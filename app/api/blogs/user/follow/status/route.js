import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const followerId = searchParams.get("followerId");
    const followingId = searchParams.get("followingId");

    if (!followerId || !followingId) {
      return NextResponse.json(
        { success: false, error: "Missing followerId or followingId" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `SELECT 1 FROM follows 
       WHERE follower_id = $1::uuid AND following_id = $2::uuid`,
      [followerId, followingId]
    );

    return NextResponse.json({
      success: true,
      isFollowing: rows.length > 0,
    });
  } catch (err) {
    console.error("Error checking follow status:", err);
    return NextResponse.json(
      { success: false, error: "Database error while checking status" },
      { status: 500 }
    );
  }
}
