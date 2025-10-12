import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request, secret: SECRET });

    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (!["draft", "trash", "published"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // Verify ownership
    const ownerCheck = await pool.query(
      "SELECT user_id FROM blogs WHERE blog_id = $1",
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    if (ownerCheck.rows[0].user_id !== token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Update status
    await pool.query(
      "UPDATE blogs SET status = $1 WHERE blog_id = $2",
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating blog status:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}