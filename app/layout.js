"use client";
import Link from "next/link";
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import "./globals.css";
import { Kalnia } from "next/font/google";

const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function Header() {
  const { openModal } = useAuthModal();

  return (
    <header className="px-4 md:px-8 py-4 flex items-center justify-between border-b transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center">
        <Link
          href="/"
          className="text-2xl md:text-3xl lg:text-5xl font-bold mx-4 md:mx-8 lg:mx-[42vh] transition-colors"
        >
          DailyBlogs
        </Link>
      </div>

      {/* Nav / Actions - Desktop */}
      <div className="hidden md:flex gap-4 lg:gap-6 items-center mr-4 md:mr-8 lg:mr-[42vh]">
        <Link href="/about" className="text-lg lg:text-xl transition-colors">
          About us
        </Link>

        <button
          className="text-lg lg:text-xl transition-colors"
          onClick={() => openModal("login")}
        >
          Sign in
        </button>

        <button
          className="px-4 lg:px-6 py-2 text-lg lg:text-xl bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
          onClick={() => openModal("signup")}
        >
          Get Started
        </button>

        <Link
          href="/setting"
          className="mx-1 transition-colors duration-200 flex items-center justify-center h-[38px] w-[38px] rounded-full"
        >
          <i className="fi fi-tc-settings text-[30px]"></i>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <button
          className="px-3 py-1 text-sm bg-black text-white rounded-full"
          onClick={() => openModal("signup")}
        >
          Get Started
        </button>
        <Link
          href="/setting"
          className="flex items-center justify-center h-[32px] w-[32px] rounded-full"
        >
          <i className="fi fi-tc-settings text-[24px]"></i>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="p-4 text-center text-lg md:text-xl lg:text-2xl transition-colors duration-300 border-t">
      This website was made by MAMA MO!
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${kalnia.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <AuthModalProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}