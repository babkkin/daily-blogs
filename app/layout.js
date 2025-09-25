"use client";
import Link from "next/link";
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import { DarkModeProvider, useDarkMode } from "./DarkModeContext";
import "./globals.css";

function Header() {
  const { openModal } = useAuthModal();
  const { darkMode } = useDarkMode();

  return (
    <header
      className={`sticky top-0 z-50 w-full shadow-md border-b px-8 py-4 flex items-center justify-between shadow-sm transition-colors duration-300
      ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className={`text-5xl font-bold m-4 mx-[42vh] transition-colors 
          ${darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-900"}`}
        >
          DailyBlogs
        </Link>
      </div>
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
          className={`px-6 py-2 text-xl rounded-full transition-colors duration-200 
          ${darkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}
          onClick={() => openModal("signup")}
        >
          Get Started
        </button>

        <Link
          href="/settings"
          className={`mx-1 pt-4 py-2 transition-colors duration-200 flex items-center justify-center h-[38px] w-[38px] rounded-full
          ${darkMode ? "text-white hover:bg-[#102b63]" : "text-black-800 hover:bg-[#e7e7e7]"}`}
        >
          <i className="fi fi-tc-settings : text-[30px]"></i>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const { darkMode } = useDarkMode();

  return (
    <footer
      className={`p-4 text-center text-2xl transition-colors duration-300
      ${darkMode ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-white border-gray-200 text-gray-500"}`}
    >
      This website was made by MAMA MO!
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediately apply dark mode from localStorage before React loads
              (function() {
                try {
                  const darkMode = localStorage.getItem("darkMode");
                  if (darkMode === "true") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalnia:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-chubby/css/uicons-thin-chubby.css"
        />
      </head>
      <body className="font-kalnia min-h-screen flex flex-col transition-colors duration-300">
        <DarkModeProvider>
          <AuthModalProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModal />
          </AuthModalProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
