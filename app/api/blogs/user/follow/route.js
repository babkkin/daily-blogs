import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET - Check if following an author
export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");
    if (!authorId) {
      return NextResponse.json({ success: false, error: "Missing authorId" }, { status: 400 });
    }

    const res = await pool.query(
      "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
      [token.userId, authorId]
    );

    return NextResponse.json({ 
      success: true, 
      isFollowing: res.rows.length > 0 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST - Toggle follow + notification
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { authorId } = await request.json();
    if (!authorId) {
      return NextResponse.json({ success: false, error: "Missing authorId" }, { status: 400 });
    }

    // Can't follow yourself
    if (token.userId === authorId) {
      return NextResponse.json({ success: false, error: "Cannot follow yourself" }, { status: 400 });
    }

    // Check if already following
    const existing = await pool.query(
      "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
      [token.userId, authorId]
    );

    if (existing.rows.length > 0) {
      // Unfollow
      await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
        [token.userId, authorId]
      );
      return NextResponse.json({ success: true, isFollowing: false });
    } else {
      // Follow + notification
      await pool.query(
        "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
        [token.userId, authorId]
      );

      // 🔔 Create notification (do nothing if it already exists)

      const actorRes = await pool.query(
          "SELECT user_name FROM users_profile WHERE user_id=$1",
          [token.userId]
        );
        const actorName = actorRes.rows[0]?.user_name || "Someone";

      await pool.query(
        `INSERT INTO notifications (user_id, actor_id, type, message, status, location_id)
         VALUES ($1, $2, 'follow', $3, 'unread', NULL)
         ON CONFLICT (user_id, actor_id, type) DO NOTHING`,
        [authorId, token.userId, `${actorName} started following you`]
      );

      return NextResponse.json({ success: true, isFollowing: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
