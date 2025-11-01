"use client";
import { useAuthModal } from "@/components/AuthModalProvider";
import InteractiveGridPattern from "@/components/ui/interactive-grid-pattern";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import Preview from "@/components/Preview";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
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
  if (status === "authenticated") return null;

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* ===== Public Header ===== */}
      <PublicHeader />

      {/* ===== Main Content ===== */}
      <main className="flex-1 relative flex items-center justify-start overflow-hidden pt-20">
        {/* Background Grid */}
        <InteractiveGridPattern
          className="absolute inset-0 -z-10 h-full w-full skew-y-12 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        />

        {/* Foreground Content */}
        <div className="flex flex-col justify-center px-4 sm:px-8 lg:mx-[44vh] py-8 md:py-16 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black mb-4 md:mb-6 lg:mt-[50px] leading-tight">
            Daily Experiences <br className="hidden sm:block" /> and Wisdom
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-6 md:mb-8">
            A safe space to read, write, and expand your knowledge
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 md:px-12 lg:px-20 py-3 md:py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-lg sm:text-xl md:text-2xl font-medium"
              onClick={() => openModal("signup")}
            >
              Join us
            </button>
          </div>
        </div>
        

      </main>
      <Preview/>

      {/* ===== Public Footer ===== */}
      <PublicFooter />
    </div>
  );
}
