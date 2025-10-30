import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

// Helper function to update user history
async function updateUserHistory(userId, type, itemId) {
  try {
    // Get blog details (category needed for recommendation system)
    const blogRes = await pool.query(
      "SELECT category FROM blogs WHERE blog_id = $1",
      [itemId]
    );

    if (!blogRes.rows[0]) {
      console.error("Blog not found for history update");
      return;
    }

    const category = blogRes.rows[0].category;

    // Ensure user_id exists in users_history
    await pool.query(
      `INSERT INTO users_history (user_id, history) 
       VALUES ($1, '{"like": [], "comment": []}') 
       ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    // Get current history
    const historyRes = await pool.query(
      "SELECT history FROM users_history WHERE user_id = $1",
      [userId]
    );

    let history = historyRes.rows[0]?.history || { like: [], comment: [] };

    // Check if item already exists and remove it (to avoid duplicates)
    history[type] = history[type].filter(entry => entry.post_id !== itemId);

    // Add new entry with timestamp at the beginning (compatible with recommendation system)
    const newEntry = {
      post_id: itemId,
      category: category,
      timestamp: new Date().toISOString()
    };

    history[type].unshift(newEntry);

    // Keep only newest 100 entries
    history[type] = history[type].slice(0, 100);

    // Update in database
    await pool.query(
      "UPDATE users_history SET history = $1 WHERE user_id = $2",
      [JSON.stringify(history), userId]
    );
  } catch (err) {
    console.error("Error updating user history:", err);
    // Don't throw - history update shouldn't break the main operation
  }
}

// Helper function to remove from user history
async function removeFromUserHistory(userId, type, itemId) {
  try {
    // Get current history
    const historyRes = await pool.query(
      "SELECT history FROM users_history WHERE user_id = $1",
      [userId]
    );

    if (!historyRes.rows[0]) return;

    let history = historyRes.rows[0].history;

    // Remove the item from history (using post_id to match recommendation system)
    history[type] = history[type].filter(entry => entry.post_id !== itemId);

    // Update in database
    await pool.query(
      "UPDATE users_history SET history = $1 WHERE user_id = $2",
      [JSON.stringify(history), userId]
    );
  } catch (err) {
    console.error("Error removing from user history:", err);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!blogId) return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });

    // Get total claps count
    const countRes = await pool.query("SELECT COUNT(*) FROM claps WHERE blog_id=$1", [blogId]);
    
    // Check if current user has clapped
    let hasClapped = false;
    if (token?.userId) {
      const userClapRes = await pool.query(
        "SELECT * FROM claps WHERE blog_id=$1 AND user_id=$2",
        [blogId, token.userId]
      );
      hasClapped = userClapRes.rows.length > 0;
    }

    return NextResponse.json({ 
      success: true, 
      claps: parseInt(countRes.rows[0].count),
      hasClapped 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await request.json();
    if (!blogId) return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });

    const userId = token.userId;

    // Check if user already clapped
    const existingClap = await pool.query(
      "SELECT * FROM claps WHERE blog_id=$1 AND user_id=$2",
      [blogId, userId]
    );

    if (existingClap.rows.length > 0) {
      // User already clapped, so remove the clap (unlike)
      await pool.query(
        "DELETE FROM claps WHERE blog_id=$1 AND user_id=$2",
        [blogId, userId]
      );

      // Remove from user history
      await removeFromUserHistory(userId, 'like', blogId);

      const countRes = await pool.query("SELECT COUNT(*) FROM claps WHERE blog_id=$1", [blogId]);
      return NextResponse.json({ 
        success: true, 
        claps: parseInt(countRes.rows[0].count),
        hasClapped: false
      });
    } else {
      // User hasn't clapped, so add a clap
      await pool.query(
        "INSERT INTO claps (blog_id, user_id) VALUES ($1, $2)",
        [blogId, userId]
      );

      // Save to user history
      await updateUserHistory(userId, 'like', blogId);

      // Create notification safely
      const blogOwnerRes = await pool.query(
        "SELECT user_id FROM blogs WHERE blog_id=$1",
        [blogId]
      );
      const blogOwnerId = blogOwnerRes.rows[0]?.user_id;

      if (blogOwnerId && blogOwnerId !== userId) {
        const actorRes = await pool.query(
          "SELECT user_name FROM users_profile WHERE user_id=$1",
          [userId]
        );
        const actorName = actorRes.rows[0]?.user_name || "Someone";

        await pool.query(
          `INSERT INTO notifications (user_id, actor_id, type, message, location_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [
            blogOwnerId,
            userId,
            "liked",
            `${actorName} liked your blog`,
            blogId
          ]
        );
      }

      const countRes = await pool.query("SELECT COUNT(*) FROM claps WHERE blog_id=$1", [blogId]);
      return NextResponse.json({ 
        success: true, 
        claps: parseInt(countRes.rows[0].count),
        hasClapped: true
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}