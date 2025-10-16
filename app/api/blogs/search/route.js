// app/api/blogs/search/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Return empty results if no query
    if (query.trim() === "") {
      return NextResponse.json({
        success: true,
        authors: [],
        blogs: [],
      });
    }

    const searchTerm = `%${query.trim()}%`;

    // Search for authors
    const authorsQuery = `
      SELECT 
        user_id AS "userId",
        user_name AS name,
        profile_url,
        bio
      FROM users_profile
      WHERE LOWER(user_name) LIKE LOWER($1)
         OR LOWER(COALESCE(bio, '')) LIKE LOWER($1)
      ORDER BY user_name ASC
      LIMIT 5
    `;

    // Search for blogs with author info (only published)
    const blogsQuery = `
      SELECT 
        b.blog_id AS id,
        b.title,
        b.subtitle,
        b.content,
        b.image_url,
        b.created_at,
        b.user_id AS author_id,
        u.user_name AS author_name
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
      WHERE b.status = 'published'
        AND (
          LOWER(b.title) LIKE LOWER($1)
          OR LOWER(COALESCE(b.subtitle, '')) LIKE LOWER($1)
          OR LOWER(COALESCE(b.content, '')) LIKE LOWER($1)
        )
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    // Execute both queries in parallel for better performance
    const [authorsResult, blogsResult] = await Promise.all([
      pool.query(authorsQuery, [searchTerm]),
      pool.query(blogsQuery, [searchTerm])
    ]);

    return NextResponse.json({
      success: true,
      authors: authorsResult.rows,
      blogs: blogsResult.rows,
    });

  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: err.message,
        authors: [],
        blogs: []
      },
      { status: 500 }
    );
  }
}
