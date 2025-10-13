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
const { rows } = await pool.query(`
  SELECT 
    n.notification_id AS id,
    n.type,
    n.message,
    n.link,
    n.is_read,
    n.created_at,
    n.actor_id,
    up.user_name AS actor_name,
    up.profile_url AS actor_profile_url
  FROM notifications n
  LEFT JOIN users_profile up ON n.actor_id = up.user_id::text
  WHERE n.user_id = $1
  ORDER BY n.created_at DESC
  LIMIT 50
`, [token.userId]);


    return NextResponse.json({ success: true, notifications: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}