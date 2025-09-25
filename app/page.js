"use client";
import { useState, useEffect } from "react";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { openModal } = useAuthModal();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark"); // optional: for global dark styles
    }
  }, []);

  return (
    <div
      className={`flex flex-col justify-center min-h-[74.5vh] transition-colors duration-300 
      ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <h1
        className={`text-8xl font-bold mt-[50px] mb-6 mx-[44vh] transition-colors duration-300
        ${darkMode ? "text-white" : "text-black"}`}
      >
        Daily Experiences <br /> and Wisdom
      </h1>
      <p
        className={`text-2xl mb-8 mx-[44vh] transition-colors duration-300
        ${darkMode ? "text-gray-300" : "text-black"}`}
      >
        A safe space to read, write, and expand your knowledge
      </p>
      <div className="mx-[44vh] flex gap-4">
        <button
          className={`px-20 py-4 rounded-full transition-colors duration-200 text-4xl font-medium
          ${darkMode ? "bg-gray-200 text-black hover:bg-gray-300" : "bg-black text-white hover:bg-gray-800"}`}
          onClick={() => openModal("signup")}
        >
          Join us
        </button>
        <button
          onClick={() => router.push("/blog-editor")}
          className={`px-20 py-4 rounded-full transition-colors duration-200 text-4xl font-medium
          ${darkMode ? "bg-gray-200 text-black hover:bg-gray-300" : "bg-black text-white hover:bg-gray-800"}`}
        >
          Editor
        </button>
      </div>
    </div>
  );
}
