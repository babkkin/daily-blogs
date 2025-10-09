"use client";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useRouter } from "next/navigation";
import InteractiveGridPattern from "@/components/ui/interactive-grid-pattern";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function HomePage() {
  const { openModal } = useAuthModal();
  const router = useRouter();

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
        <div className="flex flex-col justify-center px-4 md:px-8 lg:mx-[44vh] py-8 md:py-16 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black mb-4 md:mb-6 lg:mt-[50px]">
            Daily Experiences <br /> and Wisdom
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-black mb-6 md:mb-8">
            A safe space to read, write, and expand your knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 md:px-12 lg:px-20 py-3 md:py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium"
              onClick={() => openModal("signup")}
            >
              Join us
            </button>
            <button
              onClick={() => router.push("/blog-editor")}
              className="px-20 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-4xl font-medium"
            >
              AdminBoard
            </button>
          </div>
        </div>
      </main>

      {/* ===== Public Footer ===== */}
      <PublicFooter />
    </div>
  );
}
