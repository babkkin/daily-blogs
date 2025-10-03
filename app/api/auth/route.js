import db from "../../../lib/db.js";
import { sendVerificationEmail } from "../../../lib/mailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    // SIGNUP
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    try {
      await db.query(
        `INSERT INTO users (user_email, user_password, verification_token, provider) 
         VALUES ($1, $2, $3, 'manual')`,
        [email, hashedPassword, token]
      );

      try {
        await sendVerificationEmail(email, token);
      } catch (mailErr) {
        console.error("Email sending failed:", mailErr);
      }

      return NextResponse.json(
        { success: true, message: "Account created. Check your email." },
        { status: 200 }
      );
    } catch (dbErr) {
      if (dbErr.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        );
      }

      console.error("Database error:", dbErr);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Request error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
