import { getToken } from "next-auth/jwt";
import pool from "@/lib/db.js";

export async function PUT(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = token.userId;
    const { bio } = await req.json();

    // Update the user's bio in the database - using users_profile table
    const { rows } = await pool.query(
      `
      UPDATE users_profile
      SET bio = $1
      WHERE user_id = $2
      RETURNING bio
      `,
      [bio, userId]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, bio: rows[0].bio }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating bio:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}