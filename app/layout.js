"use client"; 
import { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState("login"); // "login" or "signup"
  const [message, setMessage] = useState("");

  const openModal = (type) => {
    setAuthType(type);
    setShowAuth(true);
  };

  const closeModal = () => setShowAuth(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.user_email.value;
    const password = e.target.user_password.value;

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, type: authType }),
    });

    const data = await response.json();
    if (data.success) {
      if (authType === "signup") {
        setMessage("Account created! Please check your email to verify your account.");
      } else {
        setMessage("Login successful!");
      }
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

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
          <div className="flex items-center gap-8">
            <Link href="/" className="text-5xl font-bold text-black m-4 mx-[42vh] hover:text-gray-900 transition-colors">
              DailyBlogs
            </Link>
          </div>
          <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap ">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-xl">About us</Link>
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
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-8 rounded-xl w-96 shadow-2xl max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="text-center text-gray-500 ml-74 hover:text-black text-5xl"
                onClick={closeModal}
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
                {authType === "login" ? "Welcome back" : "Join DailyBlogs"}
              </h2>

              {/* Google login */}
              <button
                onClick={() => alert("TODO: Google login")}
                className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <div className="my-4 flex items-center">
                <hr className="flex-1 border-gray-300" />
                <span className="px-3 text-gray-400 text-sm">or</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Email login/signup form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="user_email"
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
                    name="user_password"
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

              {message && (
                <div className="mt-4 text-center text-blue-600 font-medium">
                  {message}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() =>
                    setAuthType(authType === "login" ? "signup" : "login")
                  }
                >
                  {authType === "login"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        )}

      </body>
    </html>
  );
}
