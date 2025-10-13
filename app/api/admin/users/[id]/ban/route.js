import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { banned } = await request.json();

    await pool.query(
      "UPDATE users_profile SET is_banned = $1 WHERE user_id = $2",
      [banned, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}