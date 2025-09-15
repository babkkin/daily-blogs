"use client";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { openModal } = useAuthModal();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center min-h-[80vh]">
      <h1 className="text-8xl font-bold text-black mt-[50px] mb-6 mx-[44vh]">
        Daily Experiences <br /> and Wisdom
      </h1>
      <p className="text-2xl text-black mb-8 mx-[44vh]">
        A safe space to read, write, and expand your knowledge
      </p>
      <div className="mx-[44vh] flex gap-4">
        <button
          className="px-20 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-4xl font-medium"
          onClick={() => openModal("signup")}
        >
          Join us
        </button>
        <button
          onClick={() => router.push("/blog-editor")}
          className="px-20 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-4xl font-medium"
        >
          Editor
        </button>
      </div>
    </div>
  );
}