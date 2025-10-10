import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET all comments for a blog
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });
    }

    const res = await pool.query(
      "SELECT comment_id, blog_id, user_id, text, created_at " +
      "FROM comments WHERE blog_id=$1 ORDER BY created_at ASC",
      [blogId]
    );

    return NextResponse.json({ success: true, comments: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(request) {
  try {
    // Get user from JWT
    const token = await getToken({ req: request, secret: SECRET });
    const userId = token?.userId || null; // null if not logged in

    // Get blogId and text from request body
    const { blogId, text } = await request.json();
    if (!blogId || !text) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    const res = await pool.query(
      "INSERT INTO comments (blog_id, user_id, text) VALUES ($1, $2, $3) RETURNING comment_id, blog_id, user_id, text, created_at",
      [blogId, userId, text]
    );

    return NextResponse.json({ success: true, comment: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
