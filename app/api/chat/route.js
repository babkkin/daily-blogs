// app/api/chat/route.js
import { NextResponse } from "next/server";

const FLASK_URL = "http://127.0.0.1:5000/chat"; // your Flask backend

export async function POST(req) {
  try {
    const body = await req.json();

    // Forward message to Flask API
    const res = await fetch(FLASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json({ reply: data.reply || null });
  } catch (err) {
    console.error("Error connecting to Flask:", err);
    return NextResponse.json(
      { reply: "Sorry, I couldn't reach the server. Try again later." },
      { status: 500 }
    );
  }
}
