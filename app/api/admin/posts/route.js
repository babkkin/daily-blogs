import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        b.blog_id AS id,
        b.title,
        b.image_url,
        b.status,
        b.created_at,
        u.user_name,
        (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count,
        (SELECT COUNT(*) FROM comments WHERE blog_id::text = b.blog_id::text) as comments_count
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
      ORDER BY b.created_at DESC
    `);

    return NextResponse.json({ success: true, posts: rows });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}