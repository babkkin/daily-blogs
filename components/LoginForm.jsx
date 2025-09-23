"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/AuthModalProvider"; // ✅ import context

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { closeModal } = useAuthModal(); // ✅ grab modal closer

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const email = e.target.user_email.value;
    const password = e.target.user_password.value;

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, type: "login" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Login successful!");

        // ✅ close modal first
        closeModal();

        // ✅ then redirect
        router.push("/category");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Network error");
      console.error(err);
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

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-2"
      >
        Sign in
      </button>

      {message && <p className="text-center mt-2 text-blue-600">{message}</p>}
    </form>
  );
}
