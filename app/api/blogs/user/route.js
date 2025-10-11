import { getToken } from "next-auth/jwt";
import pool from "@/lib/db.js";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = token.userId;

    const { rows } = await pool.query(
      `
      SELECT blog_id AS id, user_id, title, content, image_url, created_at, subtitle
      FROM blogs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return new Response(JSON.stringify({ success: true, blogs: rows }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch blogs" }),
      { status: 500 }
    );
  }
}
