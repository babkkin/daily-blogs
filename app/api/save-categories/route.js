import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    const userId = token.id || token.sub;
    const { categories } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing from session" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      for (const category of categories) {
        await client.query(
          "INSERT INTO user_categories (user_id, category) VALUES ($1, $2)",
          [userId, category]
        );
      }

      return NextResponse.json({
        success: true,
        message: "Selected categories saved successfully.",
      });
    } catch (err) {
      console.error("Insert error:", err);
      return NextResponse.json(
        { error: "Failed to save categories" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving categories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
