import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

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

// GET all comments for a blog with user info (including replies)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });
    }

    const res = await pool.query(
      `SELECT 
        c.comment_id, 
        c.blog_id, 
        c.user_id, 
        c.text, 
        c.created_at,
        c.parent_comment_id,
        up.user_name,
        up.profile_url
      FROM comments c
      LEFT JOIN users_profile up ON c.user_id = up.user_id
      WHERE c.blog_id = $1 
      ORDER BY c.created_at ASC`,
      [blogId]
    );

    return NextResponse.json({ success: true, comments: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST a new comment or reply + create notification + save to history
export async function POST(request) {
  try {
    // Get user from JWT
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized - Please login to comment" }, { status: 401 });
    }

    const userId = token.userId;

    // Get blogId, text, and optional parentCommentId from request body
    const { blogId, text, parentCommentId } = await request.json();
    if (!blogId || !text) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // Insert comment with optional parent_comment_id
    const res = await pool.query(
      `INSERT INTO comments (blog_id, user_id, text, parent_comment_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING comment_id, blog_id, user_id, text, created_at, parent_comment_id`,
      [blogId, userId, text, parentCommentId || null]
    );

    const commentId = res.rows[0].comment_id;

    // Get user info for the new comment
    const userRes = await pool.query(
      `SELECT user_name, profile_url FROM users_profile WHERE user_id = $1`,
      [userId]
    );

    const comment = {
      ...res.rows[0],
      user_name: userRes.rows[0]?.user_name,
      profile_url: userRes.rows[0]?.profile_url
    };

    // Save to user history
    await updateUserHistory(userId, 'comment', blogId);

    // Create notifications
    if (parentCommentId) {
      // This is a reply - notify the parent comment author
      const parentCommentRes = await pool.query(
        `SELECT user_id FROM comments WHERE comment_id = $1`,
        [parentCommentId]
      );

      const parentCommentAuthorId = parentCommentRes.rows[0]?.user_id;

      if (parentCommentAuthorId && parentCommentAuthorId !== userId) {
        await pool.query(
          `INSERT INTO notifications (user_id, actor_id, type, message, location_id)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
          [
            parentCommentAuthorId,
            userId,
            'replied',
            `${userRes.rows[0]?.user_name} replied to your comment`,
            blogId
          ]
        );
      }
    } else {
      // This is a top-level comment - notify the blog owner
      const blogOwnerRes = await pool.query(
        `SELECT user_id FROM blogs WHERE blog_id = $1`,
        [blogId]
      );

      const blogOwnerId = blogOwnerRes.rows[0]?.user_id;

      if (blogOwnerId && blogOwnerId !== userId) {
        await pool.query(
          `INSERT INTO notifications (user_id, actor_id, type, message, location_id)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
          [
            blogOwnerId,
            userId,
            'commented',
            `${userRes.rows[0]?.user_name} commented on your blog`,
            blogId
          ]
        );
      }
    }

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE a comment (soft delete if has replies, hard delete if no replies)
export async function DELETE(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    
    if (!commentId) {
      return NextResponse.json({ success: false, error: "Missing commentId" }, { status: 400 });
    }

    // Check if the comment belongs to the user
    const checkRes = await pool.query(
      "SELECT user_id FROM comments WHERE comment_id = $1",
      [commentId]
    );

    if (checkRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    if (checkRes.rows[0].user_id !== token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized - You can only delete your own comments" }, { status: 403 });
    }

    // Check if comment has replies
    const repliesRes = await pool.query(
      "SELECT COUNT(*) as reply_count FROM comments WHERE parent_comment_id = $1",
      [commentId]
    );

    const hasReplies = parseInt(repliesRes.rows[0].reply_count) > 0;

    if (hasReplies) {
      // Soft delete: Replace content with [deleted] and mark as deleted
      await pool.query(
        "UPDATE comments SET text = $1, is_deleted = true WHERE comment_id = $2",
        ["[deleted]", commentId]
      );
      return NextResponse.json({ success: true, message: "Comment deleted (replies preserved)", softDelete: true });
    } else {
      // Hard delete: No replies, safe to remove completely
      await pool.query("DELETE FROM comments WHERE comment_id = $1", [commentId]);
      return NextResponse.json({ success: true, message: "Comment deleted", softDelete: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT (update) a comment
export async function PUT(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, text } = await request.json();
    
    if (!commentId || !text) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // Check if the comment belongs to the user
    const checkRes = await pool.query(
      "SELECT user_id FROM comments WHERE comment_id = $1",
      [commentId]
    );

    if (checkRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    if (checkRes.rows[0].user_id !== token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized - You can only edit your own comments" }, { status: 403 });
    }

    // Update the comment
    const res = await pool.query(
      "UPDATE comments SET text = $1 WHERE comment_id = $2 RETURNING comment_id, text, created_at",
      [text, commentId]
    );

    return NextResponse.json({ success: true, comment: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}