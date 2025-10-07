"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { AuthModalProvider, useAuthModal } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar"; // 👈 new sidebar import
import "./globals.css";
import { Kalnia } from "next/font/google";

const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function Header({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const { openModal } = useAuthModal();
  const pathname = usePathname();

  const isAppPage =
    pathname === "/home" || pathname === "/category" || pathname === "/setting";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b transition-colors duration-300 px-4 md:px-8 py-3 flex items-center justify-between">
      <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
      {isAppPage ? (
        // ✅ Logged-in / Home layout
        <div className="flex items-center justify-between w-full">
          
          {/* Left side - Menu + Logo + Search */}
          <div className="flex items-center gap-3">

          {/* Mini Burger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl p-1 rounded-md hover:bg-gray-100 transition"
          >
            <i className="fi fi-br-menu-burger"></i>
          </button>

          {/* Sidebar component */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Link href="/home" className="text-2xl font-bold">
              DailyBlogs
            </Link>

            {/* Search beside logo */}
            <div className="ml-3">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-[200px] focus-within:ring-2 focus-within:ring-black">
                <i className="fi fi-rr-search text-gray-500 text-lg"></i>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none px-2 w-full"
                />
              </div>
            </div>
          </div>

          {/*.  FOR Sidebar Toggle Menu (opens / closes sidebar when burger is clicked) */}

          {/* Right side - Actions */}
          <div className="flex items-center gap-5 relative">
            <button
              onClick={() => router.push("/blog-editor")}
              className="flex items-center gap-1 text-lg"
            >
              <i className="fi fi-rr-edit"></i>
              <span>Write</span>
            </button>

            {/* Notification button with placeholder */}
            <div className="relative">
              <button
                className="text-xl p-1 hover:bg-gray-100 rounded-full transition"
                onClick={() => alert('Notifications placeholder')}
              >
                <i className="fi fi-rr-bell"></i>
              </button>

              {/* Optional red dot indicator */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>

            <button className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <i className="fi fi-rr-user"></i>
            </button>
          </div>
        </div>
      ) : (
        // 🧭 Public layout
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className="text-2xl md:text-3xl lg:text-4xl font-bold transition-colors mx-4 md:mx-8 lg:mx-[42vh]"
          >
            DailyBlogs
          </Link>

          <div className="hidden md:flex gap-4 lg:gap-6 items-center mr-4 md:mr-8 lg:mr-[42vh]">
            <Link href="/about" className="text-lg lg:text-xl">
              About us
            </Link>
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
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const pathname = usePathname();

  // Hide footer on app pages
  const hideFooter =
    pathname === "/home" || pathname === "/category" || pathname === "/setting";

  if (hideFooter) return null;

  return (
    <footer className="p-4 text-center text-lg md:text-xl lg:text-2xl transition-colors duration-300 border-t">
      This website was made by MAMA MO!
    </footer>
  );
}

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${kalnia.className} min-h-screen flex flex-col transition-colors duration-300`}
      >
        <AuthModalProvider>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
