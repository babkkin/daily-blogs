import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

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

      // --- Create notification safely ---
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
            blogOwnerId,                     // recipient
            userId,                           // actor
            "liked",                          // type
            `${actorName} liked your blog`,   // message
            blogId                             // location reference
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
