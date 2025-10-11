import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET() {
	try {
		console.log("📡 Connecting to database...");

		// Fetch all blogs from the database
		const { rows } = await pool.query(`
			SELECT 
				blog_id AS id,
				user_id,
				title,
				content,
				image_url,
				subtitle,
				created_at
			FROM blogs
			ORDER BY created_at DESC
		`);

		console.log("✅ Query successful, found:", rows.length, "blogs");

		// Return success with blog list
		return NextResponse.json({ success: true, blogs: rows });
	} catch (err) {
		console.error("❌ Database error:", err.message);

		// Return a 500 response with error message
		return NextResponse.json(
			{ success: false, error: "Database error: " + err.message },
			{ status: 500 }
		);
	}
}

