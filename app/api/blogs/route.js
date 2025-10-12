import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET() {
  try {
    console.log("📡 Connecting to database...");

    const { rows } = await pool.query(`
      SELECT 
        b.blog_id AS id,
        b.user_id,
        u.user_name,
        b.title,
        b.content,
        b.image_url,
        b.subtitle,
        b.status,
        b.created_at,
        (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count,
        (SELECT COUNT(*) FROM comments WHERE blog_id::text = b.blog_id::text) as comments_count,
        (SELECT COUNT(*) FROM bookmarks WHERE blog_id::text = b.blog_id::text) as bookmarks_count
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC
    `);

    console.log("✅ Query successful, found:", rows.length, "blogs");
    return NextResponse.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    return NextResponse.json(
      { success: false, error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}