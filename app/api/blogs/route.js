import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const feedTab = url.searchParams.get("feed") || "latest"; // latest, trending, following
    const category = url.searchParams.get("category") || null;

    let token;
    if (feedTab === "following") {
      token = await getToken({ req, secret: SECRET });
      if (!token?.userId) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    let query = `
      SELECT 
        b.blog_id AS id,
        b.user_id,
        u.user_name,
        b.title,
        b.content,
        b.image_url,
        b.subtitle,
        b.status,
        b.created_at,
        (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count,
        (SELECT COUNT(*) FROM comments WHERE blog_id::text = b.blog_id::text) as comments_count,
        (SELECT COUNT(*) FROM bookmarks WHERE blog_id::text = b.blog_id::text) as bookmarks_count
    `;

    if (feedTab === "trending") {
      query += `,
        (
          (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) +
          (SELECT COUNT(*) FROM comments WHERE blog_id::text = b.blog_id::text) +
          (SELECT COUNT(*) FROM bookmarks WHERE blog_id::text = b.blog_id::text)
        ) as total_engagement
      `;
    }

    query += `
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
    `;

    const params = [];
    let whereClauses = ["b.status = 'published'"];

    if (feedTab === "following") {
      whereClauses.push("f.follower_id = $1");
      query += " INNER JOIN follows f ON b.user_id = f.following_id";
      params.push(token.userId);
    }

    if (category) {
      params.push(category);
      whereClauses.push(`b.category = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    if (feedTab === "trending") {
      query += " ORDER BY total_engagement DESC, b.created_at DESC LIMIT 50";
    } else {
      query += " ORDER BY b.created_at DESC";
    }

    const { rows } = await pool.query(query, params);

    return NextResponse.json({ success: true, blogs: rows });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    return NextResponse.json(
      { success: false, error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}
