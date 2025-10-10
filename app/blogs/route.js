import pool from "@/lib/db"; // adjust path to your DB connection

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("q") || "";

	try {
		const sql = query
			? `SELECT id, title, content, image_url, created_at
			   FROM blogs
			   WHERE title ILIKE $1 OR content ILIKE $1
			   ORDER BY created_at DESC`
			: `SELECT id, title, content, image_url, created_at
			   FROM blogs
			   ORDER BY created_at DESC`;

		const values = query ? [`%${query}%`] : [];

		const { rows } = await pool.query(sql, values);

		return new Response(JSON.stringify({ success: true, blogs: rows }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ success: false, error: err.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
