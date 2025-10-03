"use client";
import { useState } from "react";
import { useAuthModal } from "@/components/AuthModalProvider";

export default function SignupForm() {
  const [message, setMessage] = useState("");
  const { closeModal } = useAuthModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const email = e.target.user_email.value;
    const password = e.target.user_password.value;
    const confirmPassword = e.target.user_confirm_password.value;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type: "signup" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✅ Account created! Please check your email to verify.");

        setTimeout(() => closeModal(), 1500);
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error, please try again.");
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-gray-700">Email address</label>
      <input
        name="user_email"
        type="email"
        placeholder="Enter your email"
        required
        className="w-full border p-3 rounded"
      />

      <label className="text-sm font-medium text-gray-700">Password</label>
      <input
        name="user_password"
        type="password"
        placeholder="Enter your password"
        required
        className="w-full border p-3 rounded"
      />

      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        name="user_confirm_password"
        type="password"
        placeholder="Re-enter your password"
        required
        className="w-full border p-3 rounded"
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-2"
      >
        Create account
      </button>

      {message && <p className="text-center mt-2 text-blue-600">{message}</p>}
    </form>
  );
}
