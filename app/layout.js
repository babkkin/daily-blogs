"use client";
import Link from "next/link";
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import { Kalnia } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function Header() {
  const { openModal } = useAuthModal();
vercel deploy
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
      <body className={`${kalnia.className} bg-gray-50 min-h-screen flex flex-col`}>
        <AuthModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
           <Analytics />
          <Footer />
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}