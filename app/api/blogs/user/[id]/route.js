import pool from "@/lib/db.js";

export async function GET(req, { params }) {
  try {
    const { id: userId } = params;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing user ID" }),
        { status: 400 }
      );
    }

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
