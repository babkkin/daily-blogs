import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET all comments for a blog with user info
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
        up.user_name,
        up.profile_url
      FROM comments c
      LEFT JOIN users_profile up ON c.user_id = up.user_id
      WHERE c.blog_id = $1 
      ORDER BY c.created_at DESC`,
      [blogId]
    );

    return NextResponse.json({ success: true, comments: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST a new comment + create notification
export async function POST(request) {
  try {
    // Get user from JWT
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized - Please login to comment" }, { status: 401 });
    }

    const userId = token.userId;

    // Get blogId and text from request body
    const { blogId, text } = await request.json();
    if (!blogId || !text) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    // Insert comment
    const res = await pool.query(
      `INSERT INTO comments (blog_id, user_id, text) 
       VALUES ($1, $2, $3) 
       RETURNING comment_id, blog_id, user_id, text, created_at`,
      [blogId, userId, text]
    );

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

    // --- New: create notification for the blog owner ---
    const blogOwnerRes = await pool.query(
      `SELECT user_id FROM blogs WHERE blog_id = $1`,
      [blogId]
    );

    const blogOwnerId = blogOwnerRes.rows[0]?.user_id;

    if (blogOwnerId && blogOwnerId !== userId) {
      // Insert notification
      await pool.query(
        `INSERT INTO notifications (user_id, actor_id, type, message, location_id)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
        [
          blogOwnerId,                 // recipient
          userId,                      // actor
          'commented',                 // type
          `${userRes.rows[0]?.user_name} commented on your blog`, // message
          blogId                        // location reference
        ]
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


// DELETE a comment
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

    // Delete the comment
    await pool.query("DELETE FROM comments WHERE comment_id = $1", [commentId]);

    return NextResponse.json({ success: true, message: "Comment deleted" });
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