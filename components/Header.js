"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Icon styles */}
      <link
        rel="stylesheet"
        href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
      />

      {/* Left side: menu, logo, search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl p-1 rounded-md hover:bg-gray-100 transition"
        >
          <i className="fi fi-br-menu-burger"></i>
        </button>

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <Link href="/home" className="text-2xl font-bold">
          DailyBlogs
        </Link>

        <div className="ml-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-[200px] focus-within:ring-2 focus-within:ring-black transition">
            <i className="fi fi-rr-search text-gray-500 text-lg"></i>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none px-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-5 relative">
        <button
          onClick={() => router.push("/blog-editor")}
          className="flex items-center gap-1 text-lg"
        >
          <i className="fi fi-rr-edit"></i>
          <span>Write</span>
        </button>

        <div className="relative">
          <button
            className="text-xl p-1 hover:bg-gray-100 rounded-full transition"
            onClick={() => alert("Notifications placeholder")}
          >
            <i className="fi fi-rr-bell"></i>
          </button>
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>

        <button className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
        onClick={() => router.push("/user-profile")}>
          <i className="fi fi-rr-user"></i>
        </button>
      </div>
    </header>
  );
}
