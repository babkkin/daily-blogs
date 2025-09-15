"use client";
import Link from "next/link";
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

function Header() {
  const { openModal } = useAuthModal();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-5xl font-bold text-black m-4 mx-[42vh] hover:text-gray-900 transition-colors"
        >
          DailyBlogs
        </Link>
      </div>
      <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap">
        <Link
          href="/about"
          className="text-gray-600 hover:text-gray-900 transition-colors text-xl"
        >
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
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-2xl text-gray-500">
      This website was made by MAMA MO!
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalnia:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-kalnia bg-gray-50 min-h-screen flex flex-col">
        <AuthModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}