import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });

    if (!token || !token.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationId } = await request.json();

    // Update the status column to 'read' instead of using is_read
    await pool.query(
      "UPDATE notifications SET status = 'read' WHERE id = $1 AND user_id = $2",
      [notificationId, token.userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
