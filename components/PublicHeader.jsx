"use client";
import Link from "next/link";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PublicHeader() {
  const { openModal } = useAuthModal();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect from landing page ("/"), not from /about or other public pages
    if (status === "authenticated" && pathname === "/") {
      router.push("/home");
    }
  }, [status, router, pathname]);

  // Show loading state while checking session
  if (status === "loading") {
    return null;
  }

  // If logged in and NOT on about page, hide header
  if (status === "authenticated" && pathname !== "/about") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between">
      <Link href="/" className="text-2xl md:text-3xl lg:text-4xl font-bold transition-colors mx-[44vh]">
        DailyBlogs
      </Link>

      <div className="flex gap-4 lg:gap-6 items-center mr-[44vh]">
        <Link href="/about" className="text-lg lg:text-xl">About us</Link>
        
        {/* Only show auth buttons if NOT logged in */}
        {status !== "authenticated" && (
          <>
            <button 
              className="text-lg lg:text-xl"
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
          </>
        )}
      </div>
    </header>
  );
}