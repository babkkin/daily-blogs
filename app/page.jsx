"use client";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useRouter } from "next/navigation";

import InteractiveGridPattern from "@/components/ui/interactive-grid-pattern";

export default function HomePage() {
  const { openModal } = useAuthModal();
  const router = useRouter();

  return (
<main className="relative flex items-center justify-start min-h-full overflow-hidden">
      {/* Background Grid */}
      <InteractiveGridPattern
        className="absolute inset-0 -z-10 h-full w-full -top-0 -left-0 skew-y-12 mask-[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
      />

      {/* Foreground Content */}
      <div className="overflow-hidden flex flex-col justify-center h-full relative z-10">
        <h1 className="text-8xl font-bold text-black mt-[50px] mb-6 mx-[44vh]">
          Daily Experiences <br /> and Wisdom
        </h1>
        <p className="text-2xl text-black mb-8 mx-[44vh]">
          A safe space to read, write, and expand your knowledge
        </p>
        <div className="mx-[44vh] flex gap-4">
          <button
            className="px-20 py-4 bg-black  text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-4xl font-medium bg-"
            onClick={() => openModal("signup")}
          >
            Join us
          </button>
          <button
<<<<<<< Updated upstream
            onClick={() => router.push("/user-profile")}
=======
            onClick={() => router.push("/admin-dashboard")}
>>>>>>> Stashed changes
            className="px-20 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-4xl font-medium"
          >
            Editor
          </button>
        </div>
      </div>
    </main>
  );
}


