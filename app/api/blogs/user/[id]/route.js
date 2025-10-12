import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request, context) {
  // ✅ Await params in App Router dynamic API routes
  const params = await context.params;
  const id = params.id;
  const status = request.nextUrl.searchParams.get("status");

  try {
    const query = `
      SELECT 
        b.blog_id AS id,
        b.user_id,
        b.title,
        b.content,
        b.image_url,
        b.subtitle,
        b.status,
        b.created_at
      FROM blogs b
      WHERE b.user_id = $1
      ${status ? "AND b.status = $2" : ""}
      ORDER BY b.created_at DESC
    `;

    const values = status ? [id, status] : [id];
    const { rows } = await pool.query(query, values);

    return NextResponse.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    return NextResponse.json(
      { success: false, error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}
