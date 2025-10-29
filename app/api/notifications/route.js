import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });

    if (!token || !token.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");

    let query = `
      SELECT 
        n.id,
        n.type,
        n.message,
        n.status,
        n.created_at,
        n.actor_id,
        up.user_name AS actor_name,
        up.profile_url AS actor_profile_url,
        n.location_id AS blog_id,
        b.title AS blog_title
      FROM notifications n
      LEFT JOIN users_profile up ON n.actor_id = up.user_id
      LEFT JOIN blogs b ON n.location_id = b.blog_id
      WHERE n.user_id = $1
    `;
    const params = [token.userId];

    if (typeFilter) {
      query += ` AND n.type = $2`;
      params.push(typeFilter);
    }

    query += ` ORDER BY n.created_at DESC LIMIT 50`;

    const { rows } = await pool.query(query, params);

    const notifications = rows.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      is_read: n.status === "read",
      created_at: n.created_at,
      actor_id: n.actor_id,
      actor_name: n.actor_name,
      actor_profile_url: n.actor_profile_url,
      blog_id: n.blog_id,
      blog_title: n.blog_title,
    }));

    return NextResponse.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
