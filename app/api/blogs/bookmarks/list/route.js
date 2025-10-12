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

    // Get all bookmarked blogs with their details
    const { rows } = await pool.query(
      `SELECT 
        b.blog_id,
        b.title,
        b.subtitle,
        b.image_url,
        b.created_at,
        bm.created_at as bookmarked_at,
        up.user_name as author_name,
        up.profile_url as author_profile_url
      FROM bookmarks bm
      JOIN blogs b ON bm.blog_id::text = b.blog_id::text
      LEFT JOIN users_profile up ON b.user_id = up.user_id
      WHERE bm.user_id = $1
      ORDER BY bm.created_at DESC`,
      [token.userId]
    );

    return NextResponse.json({ 
      success: true, 
      bookmarks: rows 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}