import { getToken } from "next-auth/jwt";
import pool from "@/lib/db"; // Your database connection

export async function GET(req) {
  try {
    // Get logged-in user token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = token.userId;

    // Fetch user info from DB
    const result = await pool.query(
      "SELECT user_name, bio, profile_url FROM users_profile WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }

    const user = {
      name: result.rows[0].user_name,
      bio: result.rows[0].bio || "",
      profile_url: result.rows[0].profile_url || null,
    };

    return new Response(JSON.stringify({ success: true, user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
