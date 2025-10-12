// app/api/blogs/[id]/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { supabase } from "@/lib/supabaseClient.js";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req, context) {
  const { params } = context;
  const blogId = await params.id; // ✅ await before using it

  try {
    const { rows } = await pool.query("SELECT * FROM blogs WHERE blog_id=$1", [blogId]);
    if (!rows.length) return NextResponse.json({ success: false, error: "Blog not found" });
    return NextResponse.json({ success: true, blog: rows[0] });
  } catch (err) {
    console.error("GET /api/blogs/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}

export async function PUT(req, context) {
  const { params } = context;
  const blogId = params.id;

  try {
    const token = await getToken({ req, secret });
    if (!token?.sub) return NextResponse.json({ success: false, error: "Unauthorized" });

    const userId = token.sub;
    const formData = await req.formData();

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const content = formData.get("content");
    const status = formData.get("status");
    const file = formData.get("file");

    const client = await pool.connect();
    try {
      const { rows: existingRows } = await client.query(
        "SELECT image_url FROM blogs WHERE blog_id=$1 AND user_id=$2",
        [blogId, userId]
      );

      if (!existingRows.length) {
        return NextResponse.json({ success: false, error: "Blog not found or not authorized" });
      }

      let imageUrl = existingRows[0].image_url;

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file, { contentType: file.type, upsert: false });

        if (uploadError) return NextResponse.json({ success: false, error: "Image upload failed" });

        const { data: publicUrlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const query = `
        UPDATE blogs
        SET title=$1, subtitle=$2, content=$3, status=$4, image_url=$5
        WHERE blog_id=$6 AND user_id=$7
        RETURNING *;
      `;
      const values = [title, subtitle, content, status, imageUrl, blogId, userId];

      const { rows } = await client.query(query, values);
      return NextResponse.json({ success: true, blog: rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("PUT /api/blogs/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}

export async function DELETE(req, context) {
  const { params } = context;
  const blogId = await params.id; // ✅ await before using it for consistency

  try {
    // Check if user is logged in
    const token = await getToken({ req, secret });
    if (!token?.sub) return NextResponse.json({ success: false, error: "Unauthorized" });

    const userId = token.sub;

    // Delete blog if it belongs to the user
    const { rowCount } = await pool.query(
      "DELETE FROM blogs WHERE blog_id=$1 AND user_id=$2",
      [blogId, userId]
    );

    if (rowCount === 0) {
      return NextResponse.json({ success: false, error: "Blog not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/blogs/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}