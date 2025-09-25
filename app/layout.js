"use client";
import Link from "next/link";
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import { DarkModeProvider, useDarkMode } from "./DarkModeContext";
import "./globals.css";
import { Kalnia } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function Header() {
  const { openModal } = useAuthModal();
  const { darkMode } = useDarkMode();

  return (
    <header
      className={`px-8 py-4 flex items-center justify-between shadow-sm border-b transition-colors duration-300
      ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className={`text-5xl font-bold m-4 mx-[42vh] transition-colors
          ${darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-900"}`}
        >
          DailyBlogs
        </Link>
      </div>

      {/* Nav / Actions */}
      <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap">
        <Link
          href="/about"
          className={`text-xl transition-colors
          ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
        >
          About us
        </Link>

        <button
          className={`text-xl transition-colors
          ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
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

        <Link
          href="/setting"
          className={`mx-1 transition-colors duration-200 flex items-center justify-center 
          h-[38px] w-[38px] rounded-full
          ${darkMode ? "text-white hover:bg-[#102b63]" : "text-gray-800 hover:bg-[#e7e7e7]"}`}
        >
          <i className="fi fi-tc-settings : text-[30px]"></i>
          {/* Or FontAwesome:
              <i className="fa-solid fa-gear text-[30px]"></i> */}
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const { darkMode } = useDarkMode();

  return (
    <footer
      className={`p-4 text-center text-2xl transition-colors duration-300 border-t
      ${darkMode ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-white border-gray-200 text-gray-500"}`}
    >
      This website was made by MAMA MO!
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${kalnia.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <DarkModeProvider>
          <AuthModalProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Analytics />
            <Footer />
            <AuthModal />
          </AuthModalProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
