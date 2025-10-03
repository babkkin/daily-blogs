import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getLandingPage } from "@/lib/getLandingPage";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const path = await getLandingPage(token.userId);
  return NextResponse.redirect(new URL(path, req.url));
}
