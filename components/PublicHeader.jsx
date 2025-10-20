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
    if (status === "authenticated" && pathname === "/") {
      router.push("/landing");
    }
  }, [status, router, pathname]);

  if (status === "loading") return null;
  if (status === "authenticated" && pathname !== "/about") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex flex-wrap items-center justify-center lg:justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl md:text-3xl lg:text-4xl font-semibold transition-colors text-center mx-auto lg:mx-[44vh]"
      >
        <h1>        DailyBlogs</h1>

      </Link>

      {/* Right-side links */}
      <div className="flex flex-wrap justify-center lg:justify-end gap-3 md:gap-4 lg:gap-6 items-center w-full lg:w-auto mt-2 lg:mt-0 lg:mr-[44vh]">
        <Link href="/about" className="text-base sm:text-lg lg:text-xl">
          About us
        </Link>

        {status !== "authenticated" && (
          <>
            <button
              className="text-base sm:text-lg lg:text-xl"
              onClick={() => openModal("login")}
            >
              Sign in
            </button>
            <button
              className="px-3 sm:px-4 lg:px-6 py-2 text-base sm:text-lg lg:text-xl bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
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
