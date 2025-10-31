import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import pool from "@/lib/db.js";
import { supabase } from "@/lib/supabaseClient.js";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  const token = await getToken({ req, secret });
  const userId = token.sub;
  const formData = await req.formData();

  const userName = formData.get("username");
  const file = formData.get("photo");

  let imageUrl = null;

  const client = await pool.connect();

  // 🧠 Get old image URL (if exists)
  const { rows } = await client.query(
    "SELECT profile_url FROM users_profile WHERE user_id = $1",
    [userId]
  );
  const oldImageUrl = rows[0]?.profile_url;

  // 🖼️ Upload new file if provided
  if (file && file.name) {
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage
      .from("blog-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;

    // 🗑️ Delete old file from Supabase (if exists)
    if (oldImageUrl) {
      const oldFileName = oldImageUrl.split("/").pop(); // extract filename from URL
      await supabase.storage.from("blog-images").remove([oldFileName]);
    }
  }

  // 🧾 Update user profile
  await client.query(
    `
    INSERT INTO users_profile (user_id, user_name, profile_url)
    VALUES ($1, COALESCE($2, (SELECT user_name FROM users_profile WHERE user_id = $1)), COALESCE($3, (SELECT profile_url FROM users_profile WHERE user_id = $1)))
    ON CONFLICT (user_id)
    DO UPDATE SET 
      user_name = COALESCE(EXCLUDED.user_name, users_profile.user_name),
      profile_url = COALESCE(EXCLUDED.profile_url, users_profile.profile_url)
    `,
    [userId, userName, imageUrl]
  );

  client.release();

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully.",
    imageUrl,
  });
}
