"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // "email" -> "otp"
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setMessage("Enter an email");

    setMessage("Sending OTP...");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStep("otp");
      setMessage("OTP sent. Check your email.");
    } else {
      const data = await res.json();
      setMessage(data?.error || "Failed to send OTP");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage("Enter the OTP");

    setMessage("Verifying...");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      otp,
    });

    if (result?.ok) {
      // redirect to homepage (or callbackUrl)
      window.location.href = "/";
    } else {
      setMessage("Invalid OTP or expired. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign in to DailyBlogs</h1>

        {message && <div className="mb-4 text-center text-sm text-gray-600">{message}</div>}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
