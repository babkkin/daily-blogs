import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });

    if (!token || !token.userId) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Count notifications where status is not 'read'
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND status <> 'read'",
      [token.userId]
    );

    return NextResponse.json({ success: true, count: parseInt(rows[0].count) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
