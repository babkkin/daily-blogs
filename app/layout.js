"use client"; 
import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login"); // "login" or "signup"

  const openModal = (type) => {
    setAuthType(type);
    setShowAuth(true);
  };

  const closeModal = () => setShowAuth(false);

  return (
    <html lang="en">
      <body className="font-sans">
        {/* Header */}
        <header className="p-4 border-b border-blue-500 flex items-center">
          {/* Left side */}
          <div className="flex gap-4">
            <Link href="/"><ul>DailyBlogs</ul></Link>
            <Link href="/blog">Blog</Link>
          </div>

          {/* Right side: Blog + Sign in + Get Started */}
          <div className="flex gap-4 ml-auto items-center">
            <Link href="/about">About</Link>
            <button
              className="px-3 py-1 text-black rounded"
              onClick={() => openModal("login")}
            >
              Sign in
            </button>
            <button
              className="px-3 py-1 bg-black text-white rounded hover:bg-black"
              onClick={() => openModal("signup")}
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 min-h-[70vh]">{children}</main>

        {/* Footer */}
        <footer className="p-4 border-t border-red-500 text-center">
          © 2025 My Blog
        </footer>

        {/* Modal */}
        {showAuth && (
          <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 mt-0"
            onClick={closeModal}
          >
            <div
              className="bg-white p-8 rounded-lg w-96 shadow-lg -translate-y-60"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <h2 className="text-xl font-semibold mb-4">
                {authType === "login" ? "Login" : "Join Us"}
              </h2>
              <h3>
                Your Email
              </h3>
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-black/70 text-white py-2 rounded hover:bg-black"
                >
                  {authType === "login" ? "Login" : "Join Us"}
                </button>
              </form>
              <button
                className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
