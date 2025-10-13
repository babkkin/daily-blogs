import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET() {
  try {
    // Safe query: cast text to uuid only if needed
const query = `
  SELECT 
    up.user_id,
    up.user_name,
    up.bio,
    up.profile_url,
    up.is_banned,
    COUNT(DISTINCT b.blog_id) AS post_count,
    COUNT(DISTINCT f.follower_id) AS followers_count
  FROM users_profile up
  LEFT JOIN blogs b 
    ON b.user_id = up.user_id::uuid
  LEFT JOIN follows f 
    ON f.following_id = up.user_id::uuid
  GROUP BY up.user_id, up.user_name, up.bio, up.profile_url, up.is_banned
  ORDER BY post_count DESC
`;


    const { rows } = await pool.query(query);

    return NextResponse.json({ success: true, users: rows });
  } catch (err) {
    console.error("Error fetching users:", err.stack || err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
