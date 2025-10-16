"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import SignOut from "./SignOut";
import Image from "next/image";
import { Menu, SquarePen, Bell } from "lucide-react";
import BetterSearchUI from "./BetterSearchUi";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Close profile dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  // Fetch user data for profile picture
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count");
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />

        {/* ===== Left Section ===== */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl p-1 text-gray-800/70 rounded-md hover:text-black transition mt-1 flex-shrink-0"
          >
            <Menu size={18} className="text-xl flex-shrink-0" />
          </button>

          <Link href="/home" className="text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap mr-4 flex-shrink-0">
            <h1>DailyBlogs</h1>
          </Link>

          {/* ===== Search Section (Extracted Component) ===== */}
          <div className="flex-1 min-w-0">
            <BetterSearchUI />
          </div>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-8 flex-wrap">
          {/* BLOG WRITING */}
          <button
            onClick={() => router.push("/blog-editor")}
            className="flex items-center gap-1 text-sm sm:text-base md:text-lg text-gray-800/70 hover:text-black order-1"
          >
            <SquarePen className="fi fi-rr-edit text-xl sm:text-2xl mt-1 mr-1.5 flex-shrink-0" />
            <span className="hidden sm:inline">Write</span>
          </button>

          {/* Notifications */}
          <div className="relative flex-shrink-0 order-2">
            <button
              className="text-xl text-gray-800/70 p-1 mt-1 hover:text-black rounded-full transition"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="text-2xl" />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative profile-dropdown-container flex-shrink-0 order-3">
            <button
              className="h-10 w-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center hover:opacity-90 transition"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {userData?.profile_url ? (
                <Image
                  src={userData.profile_url}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-white text-lg font-bold">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-full sm:w-64 p-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 max-w-[90vw]">
                {/* View Profile */}
                <button
                  onClick={() => {
                    router.push(`/profile/${userData?.userId}`);
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 transition border-b border-gray-100 text-gray-800/70 hover:text-black"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center flex-shrink-0">
                    {userData?.profile_url ? (
                      <Image
                        src={userData.profile_url}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-sm truncate">{userData?.name || "User"}</p>
                    <p className="text-xs">View Profile</p>
                  </div>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    router.push("/home/setting/account");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-800/70 hover:text-black transition text-left"
                >
                  <i className="fi fi-rr-settings text-xl flex-shrink-0"></i>
                  <span className="text-sm">Settings</span>
                </button>

                {/* Help */}
                <button
                  onClick={() => {
                    router.push("/help");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-gray-800/70 hover:text-black transition text-left"
                >
                  <i className="fi fi-rr-interrogation text-xl flex-shrink-0"></i>
                  <span className="text-sm">Help</span>
                </button>

                {/* Sign Out */}
                <div className="border-t border-gray-100">
                  <SignOut />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}