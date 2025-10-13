import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET() {
  try {
    // Get 4 random popular blogs (by claps count)
    const { rows } = await pool.query(`
      SELECT 
        b.blog_id AS id,
        b.title,
        b.content,
        u.user_name,
        (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
      WHERE b.status = 'published'
      ORDER BY claps_count DESC, RANDOM()
      LIMIT 4
    `);

    return NextResponse.json({ 
      success: true, 
      blogs: rows 
    });
  } catch (err) {
    console.error("Error fetching recommended blogs:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}