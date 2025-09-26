import db from "../../../lib/db.js";
import { sendVerificationEmail } from "../../../lib/mailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, type } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    if (type === "signup") {
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
    }

    if (type === "login") {
      try {
        const result = await db.query(
          `SELECT user_id, user_password, provider, verified 
           FROM users WHERE user_email = $1`,
          [email]
        );

        if (result.rows.length === 0) {
          return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
          );
        }

        const user = result.rows[0];

        if (user.provider === "google") {
          return NextResponse.json(
            { success: false, error: "This account uses Google login. Please sign in with Google." },
            { status: 400 }
          );
        }

        if (!user.verified) {
          return NextResponse.json(
            { success: false, error: "Please verify your email before logging in." },
            { status: 403 }
          );
        }

        const isMatch = await bcrypt.compare(password, user.user_password);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Invalid password" },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { success: true, message: "Login successful", userId: user.user_id },
          { status: 200 }
        );
      } catch (dbErr) {
        console.error("Database error:", dbErr);
        return NextResponse.json(
          { success: false, error: "Database error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid type" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Request error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
