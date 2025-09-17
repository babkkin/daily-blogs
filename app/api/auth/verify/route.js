import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const record = await db.verificationTokens.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await db.users.update({
    where: { email: record.email },
    data: { verified: true },
  });

  await db.verificationTokens.delete({ where: { token } });

  return NextResponse.redirect("/verified");
}
