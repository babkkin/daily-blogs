import pool from "@/lib/db.js";

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT user_id, title, content, image_url, created_at
      FROM blogs
      ORDER BY created_at DESC
    `);

    return Response.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return Response.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}
