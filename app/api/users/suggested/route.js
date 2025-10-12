import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    const currentUserId = token?.userId || null;

    let query, params;

    if (currentUserId) {
      // If logged in, suggest users they're NOT following
query = `
  SELECT 
    up.user_id,
    up.user_name,
    up.bio,
    up.profile_url,
    CASE WHEN f.follower_id IS NOT NULL THEN true ELSE false END AS is_following
  FROM users_profile up
  LEFT JOIN follows f 
    ON up.user_id::text = f.following_id::text AND f.follower_id::text = $1
  WHERE up.user_id::text != $1
    AND f.follower_id IS NULL
  ORDER BY RANDOM()
  LIMIT 3
`;

      params = [currentUserId];
    } else {
      // If not logged in, suggest random users
      query = `
        SELECT 
          user_id,
          user_name,
          bio,
          profile_url,
          false as is_following
        FROM users_profile
        ORDER BY RANDOM()
        LIMIT 3
      `;
      params = [];
    }

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      users: rows
    });
  } catch (err) {
    console.error("Error fetching suggested users:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}