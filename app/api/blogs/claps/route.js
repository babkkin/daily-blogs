import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });

    const res = await pool.query("SELECT COUNT(*) FROM claps WHERE blog_id=$1", [blogId]);
    return NextResponse.json({ success: true, claps: parseInt(res.rows[0].count) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { blogId, userId } = await request.json();
    if (!blogId) return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });

    await pool.query("INSERT INTO claps (blog_id, user_id) VALUES ($1, $2)", [blogId, userId || null]);
    const res = await pool.query("SELECT COUNT(*) FROM claps WHERE blog_id=$1", [blogId]);
    return NextResponse.json({ success: true, claps: parseInt(res.rows[0].count) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
