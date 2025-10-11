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
        b.created_at
      FROM blogs b
      LEFT JOIN users_profile u
        ON b.user_id = u.user_id
      ORDER BY b.created_at DESC
    `);

    console.log("✅ Query successful, found:", rows.length, "blogs");

    // Return success with blog list
    return NextResponse.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("❌ Database error:", err.message);

    // Return a 500 response with error message
    return NextResponse.json(
      { success: false, error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}
