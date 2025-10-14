import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });

    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("📡 Fetching blogs from followed users...");

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
      INNER JOIN follows f ON b.user_id = f.following_id
      WHERE b.status = 'published'
        AND f.follower_id = $1
      ORDER BY b.created_at DESC
      LIMIT 50
    `, [token.userId]);

    console.log("✅ Query successful, found:", rows.length, "blogs from followed users");
    return NextResponse.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    return NextResponse.json(
      { success: false, error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}