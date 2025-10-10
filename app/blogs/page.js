import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json({ success: false, error: "Missing blog ID" }, { status: 400 });
	}

	try {
		const { rows } = await pool.query(
			`SELECT blog_id AS id, user_id, title, content, image_url, created_at FROM blogs WHERE blog_id = $1`,
			[id]
		);

		if (rows.length === 0) {
			return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, blog: rows[0] });
	} catch (err) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}
