import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET - Check if blog is bookmarked
export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    
    if (!blogId) {
      return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });
    }

    const res = await pool.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 AND blog_id = $2",
      [token.userId, blogId]
    );

    return NextResponse.json({ 
      success: true, 
      isBookmarked: res.rows.length > 0 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST - Toggle bookmark
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });
    
    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await request.json();
    
    if (!blogId) {
      return NextResponse.json({ success: false, error: "Missing blogId" }, { status: 400 });
    }

    // Check if already bookmarked
    const existing = await pool.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 AND blog_id = $2",
      [token.userId, blogId]
    );

    if (existing.rows.length > 0) {
      // Remove bookmark
      await pool.query(
        "DELETE FROM bookmarks WHERE user_id = $1 AND blog_id = $2",
        [token.userId, blogId]
      );
      return NextResponse.json({ success: true, isBookmarked: false });
    } else {
      // Add bookmark
      await pool.query(
        "INSERT INTO bookmarks (user_id, blog_id) VALUES ($1, $2)",
        [token.userId, blogId]
      );
      return NextResponse.json({ success: true, isBookmarked: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}