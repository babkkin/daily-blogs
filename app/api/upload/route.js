import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import pool from "@/lib/db.js";
import { supabase } from "@/lib/supabaseClient.js";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  try {
    const token = await getToken({ req, secret });
    if (!token?.sub)
      return NextResponse.json({ success: false, error: "Unauthorized" });

    const userId = token.sub;
    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const content = formData.get("content");
    const subtitle = formData.get("subtitle");
    const status = formData.get("status") || "published"; // ✅ important

    let imageUrl = null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (error)
        return NextResponse.json({ success: false, error: "Image upload failed" });

      const { data: publicUrlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO blogs (user_id, title, content, image_url, subtitle, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, title, content, imageUrl, subtitle, status]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({
      success: true,
      message: status === "draft" ? "Draft saved!" : "Blog post published!",
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Server error while uploading blog.",
    });
  }
}
