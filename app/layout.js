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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Kalnia:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-kalnia bg-gray-50 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-5xl font-bold text-black m-4 mx-[42vh] hover:text-gray-900 transition-colors">
              DailyBlogs
            </Link>
          </div>

          {/* Right side */}
          <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap ">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-xl">
              About us
            </Link>
            <button
              className="text-gray-600 text-xl hover:text-gray-900 transition-colors"
              onClick={() => openModal("login")}
            >
              Sign in
            </button>
            <button
              className="px-6 py-2 text-xl bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
              onClick={() => openModal("signup")}
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-2xl text-gray-500">
          This website was made by MAMA MO!
        </footer>

        {/* Modal */}
        {showAuth && (
          <div
            className="fixed inset-0 bg-black/50  flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-8 rounded-xl w-96 shadow-2xl max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {authType === "login" ? "Welcome back" : "Join DailyBlogs"}
              </h2>
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium mt-2"
                >
                  {authType === "login" ? "Sign in" : "Create account"}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setAuthType(authType === "login" ? "signup" : "login")}
                >
                  {authType === "login" 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>

              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}