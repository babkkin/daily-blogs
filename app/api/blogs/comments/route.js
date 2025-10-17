import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// Helper: Add security headers
const addSecurityHeaders = (response) => {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
};

// GET all comments for a blog with user info and nested replies
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 }));
    }
// In GET query:
const res = await pool.query(
  `SELECT DISTINCT ON (c.comment_id)
    c.comment_id, 
    c.blog_id, 
    c.user_id, 
    c.text, 
    c.created_at,
    c.parent_id,
    up.user_name,
    up.profile_url
  FROM comments c
  LEFT JOIN users_profile up ON c.user_id = up.user_id
  WHERE c.blog_id = $1 
  ORDER BY c.comment_id, c.parent_id IS NULL DESC, c.created_at DESC`,  // c.comment_id first for stability
  [blogId]
);

    // Organize comments into parent-child structure (unchanged, but no reverse needed)
    const commentsMap = {};
    const topLevelComments = [];

    res.rows.forEach((comment) => {
      commentsMap[comment.comment_id] = { ...comment, replies: [] };
    });

    res.rows.forEach((comment) => {
      if (comment.parent_id) {
        if (commentsMap[comment.parent_id]) {
          commentsMap[comment.parent_id].replies.push(commentsMap[comment.comment_id]);
        }
      } else {
        topLevelComments.push(commentsMap[comment.comment_id]);
      }
    });

    // New: Sort replies newest first if needed
    Object.values(commentsMap).forEach((c) => {
      if (c.replies.length > 0) {
        c.replies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    });

    return addSecurityHeaders(NextResponse.json({ success: true, comments: topLevelComments }));
  } catch (err) {
    console.error(err);
    return addSecurityHeaders(NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 }));
  }
}

// POST a new comment or reply
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    if (!token || !token.userId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized - Please login to comment" }, { status: 401 }));
    }

    const userId = token.userId;
    const { blogId, text, parent_id } = await request.json();
    const trimmedText = text?.trim();

    // New: Validation
    if (!blogId || !trimmedText || trimmedText.length > 500) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Invalid text: must be 1-500 chars" }, { status: 400 }));
    }

    let parent_id_final = null;
    if (parent_id) {
      // New: Validate parent_id
      const parentCheck = await pool.query(
        "SELECT comment_id FROM comments WHERE comment_id = $1 AND blog_id = $2",
        [parent_id, blogId]
      );
      if (parentCheck.rows.length === 0) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: "Invalid parent comment" }, { status: 400 }));
      }
      parent_id_final = parent_id;
    }

    // Insert comment
    const res = await pool.query(
      `INSERT INTO comments (blog_id, user_id, text, parent_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING comment_id, blog_id, user_id, text, created_at, parent_id`,
      [blogId, userId, trimmedText, parent_id_final]
    );

    // Get user info
    const userRes = await pool.query(
      `SELECT user_name, profile_url FROM users_profile WHERE user_id = $1`,
      [userId]
    );

    const comment = {
      ...res.rows[0],
      user_name: userRes.rows[0]?.user_name,
      profile_url: userRes.rows[0]?.profile_url,
      replies: [],
    };

    return addSecurityHeaders(NextResponse.json({ success: true, comment }));
  } catch (err) {
    console.error(err);
    return addSecurityHeaders(NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 }));
  }
}

// DELETE a comment
export async function DELETE(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    if (!token || !token.userId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Missing commentId" }, { status: 400 }));
    }

    // Check ownership
    const checkRes = await pool.query("SELECT user_id FROM comments WHERE comment_id = $1", [commentId]);
    if (checkRes.rows.length === 0) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 }));
    }

    if (checkRes.rows[0].user_id !== token.userId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized - You can only delete your own comments" }, { status: 403 }));
    }

    // New: Recursive delete for subtree (replies)
    await pool.query(
      `
      WITH RECURSIVE comment_tree AS (
        SELECT comment_id FROM comments WHERE comment_id = $1
        UNION ALL
        SELECT c.comment_id FROM comments c
        INNER JOIN comment_tree ct ON c.parent_id = ct.comment_id
      )
      DELETE FROM comments WHERE comment_id IN (SELECT comment_id FROM comment_tree)
      `,
      [commentId]
    );

    return addSecurityHeaders(NextResponse.json({ success: true, message: "Comment deleted" }));
  } catch (err) {
    console.error(err);
    return addSecurityHeaders(NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 }));
  }
}

// PUT (update) a comment
export async function PUT(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    if (!token || !token.userId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
    }

    const { commentId, text } = await request.json();
    const trimmedText = text?.trim();

    // New: Validation
    if (!commentId || !trimmedText || trimmedText.length > 500) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Invalid text: must be 1-500 chars" }, { status: 400 }));
    }

    // Check ownership
    const checkRes = await pool.query("SELECT user_id FROM comments WHERE comment_id = $1", [commentId]);
    if (checkRes.rows.length === 0) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 }));
    }

    if (checkRes.rows[0].user_id !== token.userId) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: "Unauthorized - You can only edit your own comments" }, { status: 403 }));
    }

    // Update and fetch full comment
    const res = await pool.query(
      "UPDATE comments SET text = $1 WHERE comment_id = $2 RETURNING comment_id, text, created_at, blog_id, user_id, parent_id",
      [trimmedText, commentId]
    );

// In PUT's fullRes (same):
const fullRes = await pool.query(
  `SELECT DISTINCT ON (c.comment_id)
    c.comment_id, c.blog_id, c.user_id, c.text, c.created_at, c.parent_id,
    up.user_name, up.profile_url
  FROM comments c
  LEFT JOIN users_profile up ON c.user_id = up.user_id
  WHERE c.comment_id = $1
  ORDER BY c.comment_id`,
  [commentId]
);

    const comment = { ...fullRes.rows[0], replies: [] };

    return addSecurityHeaders(NextResponse.json({ success: true, comment }));
  } catch (err) {
    console.error(err);
    return addSecurityHeaders(NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 }));
  }
}