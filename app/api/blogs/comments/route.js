import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });

    const res = await pool.query(
      "SELECT * FROM comments WHERE blog_id=$1 ORDER BY created_at ASC",
      [blogId]
    );
    return NextResponse.json({ success: true, comments: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { blogId, userId, text } = await request.json();
    if (!blogId || !text) return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });

    const res = await pool.query(
      "INSERT INTO comments (blog_id, user_id, text) VALUES ($1, $2, $3) RETURNING *",
      [blogId, userId || null, text]
    );
    return NextResponse.json({ success: true, comment: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
