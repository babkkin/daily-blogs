"use client";
import Link from "next/link";
import { useAuthModal } from "@/components/AuthModalProvider";

export default function PublicHeader() {
  const { openModal } = useAuthModal();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 md:px-8 py-3 flex items-center justify-between">
      <Link href="/" className="text-2xl md:text-3xl lg:text-4xl font-bold transition-colors">
        DailyBlogs
      </Link>

      <div className="hidden md:flex gap-4 lg:gap-6 items-center">
        <Link href="/about" className="text-lg lg:text-xl">About us</Link>
        <button className="text-lg lg:text-xl"
        onClick={() => openModal("login")}>Sign in</button>
        <button className="px-4 lg:px-6 py-2 text-lg lg:text-xl bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
        onClick={() => openModal("signup")}>
          Get Started
        </button>
      </div>
    </header>
  );
}
