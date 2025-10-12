import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req, { params }) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ get target user id from route param
    const { id: targetUserId } = await params;

    const followerId = token.userId;

    if (!targetUserId || !followerId) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
        { status: 400 }
      );
    }

    // ✅ delete follow record
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [followerId, targetUserId]
    );

    return NextResponse.json({ success: true, isFollowing: false });
  } catch (err) {
    console.error("Error unfollowing user:", err);
    return NextResponse.json(
      { success: false, error: "Failed to unfollow" },
      { status: 500 }
    );
  }
}
