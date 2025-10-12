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

    // Get all users the current user is following
    const { rows } = await pool.query(
      `SELECT 
        up.user_id,
        up.user_name,
        up.profile_url
      FROM follows f
      JOIN users_profile up ON f.following_id = up.user_id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC`,
      [token.userId]
    );

    return NextResponse.json({ 
      success: true, 
      following: rows 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}