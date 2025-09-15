import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json(
				{ success: false, error: "No file uploaded" },
				{ status: 400 }
			);
		}

		// Convert file -> buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Save in /public/uploads
		const uploadDir = path.join(process.cwd(), "public/uploads");
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		// Unique filename
		const fileName = `${Date.now()}-${file.name}`;
		const filePath = path.join(uploadDir, fileName);

		fs.writeFileSync(filePath, buffer);

		// Return URL
		return NextResponse.json({
			success: true,
			url: `/uploads/${fileName}`,
		});
	} catch (err) {
		console.error("Upload error:", err);
		return NextResponse.json(
			{ success: false, error: "Upload failed" },
			{ status: 500 }
		);
	}
}
