import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id) return NextResponse.json({ success: false, error: "Missing blog ID" }, { status: 400 });

	try {
		const { rows } = await pool.query(
			`SELECT 
				b.blog_id AS id,
				b.user_id,
				b.title,
				b.subtitle,
				b.content,
				b.image_url,
				b.created_at,
				up.user_name AS author_name,
				up.profile_url AS author_profile_url
			FROM blogs b
			LEFT JOIN users_profile up ON b.user_id = up.user_id
			WHERE b.blog_id = $1`,
			[id]
		);

		if (rows.length === 0) return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });

		return NextResponse.json({ success: true, blog: rows[0] });
	} catch (err) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}