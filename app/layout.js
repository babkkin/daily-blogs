"use client";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalnia:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-kalnia bg-gray-50 min-h-screen flex flex-col">
        <SessionProvider>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            {/* Left side */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-5xl font-bold text-black m-4 mx-[42vh] hover:text-gray-900 transition-colors"
              >
                DailyBlogs
              </Link>
            </div>

            {/* Right side */}
            <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap">
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 transition-colors text-xl"
              >
                About us
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-600 text-xl hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signin"
                className="px-6 py-2 text-xl bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 p-4 text-center text-2xl text-gray-500">
            This website was made by MAMA MO!
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
