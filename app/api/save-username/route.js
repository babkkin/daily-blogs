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
  }

  const client = await pool.connect();

  await client.query(
    `
    INSERT INTO users_profile (user_id, user_name, profile_url)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET user_name = EXCLUDED.user_name,
                  profile_url = EXCLUDED.profile_url
  `,
    [userId, userName, imageUrl]
  );

  client.release();

  return NextResponse.json({
    success: true,
    message: "Username and image saved.",
    imageUrl,
  });
}
