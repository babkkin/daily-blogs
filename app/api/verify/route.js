import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await db.query(
      "UPDATE users SET verified = true, verification_token = NULL WHERE user_id = $1",
      [user.user_id]
    );

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`);
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
