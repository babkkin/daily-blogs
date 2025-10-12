import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params; // Add await here
  if (!id) return new Response(JSON.stringify({ success: false, error: "Missing id" }), { status: 400 });

  const result = await pool.query(
    "SELECT user_name, bio, profile_url FROM users_profile WHERE user_id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({
    success: true,
    user: {
      userId: id,
      name: result.rows[0].user_name,
      bio: result.rows[0].bio || "",
      profile_url: result.rows[0].profile_url || null,
    }
  }), { status: 200 });
}