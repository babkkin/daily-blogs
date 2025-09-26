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
    <header className="px-8 py-4 flex items-center justify-between border-b transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-5xl font-bold m-4 mx-[42vh] transition-colors"
        >
          DailyBlogs
        </Link>
      </div>

      {/* Nav / Actions */}
      <div className="flex gap-6 items-center mr-[42vh] whitespace-nowrap">
        <Link href="/about" className="text-xl transition-colors">
          About us
        </Link>

        <button
          className="text-xl transition-colors"
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
          className="mx-1 transition-colors duration-200 flex items-center justify-center h-[38px] w-[38px] rounded-full"
        >
          <i className="fi fi-tc-settings text-[30px]"></i>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="p-4 text-center text-2xl transition-colors duration-300 border-t">
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
          <main className="flex-1 ">
            {children}
          </main>
         <Footer />
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
