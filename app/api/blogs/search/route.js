import { NextResponse } from "next/server";
import pool from "@/lib/db.js"; // server-only

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q") || "";

	let sql = `
		SELECT blog_id AS id, title, content, image_url, created_at
		FROM blogs
	`;
	let values = [];

	if (query.trim() !== "") {
		sql += ` WHERE title ILIKE $1 OR user ILIKE $1`;
		values.push(`%${query}%`);
	}

	sql += ` ORDER BY created_at DESC`;

	try {
		const { rows } = await pool.query(sql, values);
		return NextResponse.json({ success: true, blogs: rows });
	} catch (err) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}
