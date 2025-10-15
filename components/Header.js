"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Image from "next/image";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const dropdownRef = useRef(null);

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

  // Fetch search results live
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/blogs/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.blogs);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [searchQuery]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (id) => {
    router.push(`/blogs/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

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
        <div className="flex items-center gap-3 flex-1 min-w-[180px] sm:min-w-[220px] md:min-w-[300px]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl p-1 text-gray-800/70 rounded-md hover:text-black transition"
          >
            <i className="fi fi-br-menu-burger"></i>
          </button>

          <Link href="/home" className="text-xl sm:text-2xl font-bold whitespace-nowrap">
            <h1>DailyBlogs</h1>
          </Link>

          {/* ===== Search Section ===== */}
          <div className="relative flex-1">
            {/* Desktop search */}
            <div className="hidden sm:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-[250px] focus-within:ring-2 focus-within:ring-black transition"
              >
                <i className="fi fi-rr-search text-gray-500 text-lg"></i>
                <input
                  type="text"
                  placeholder="Search blogs or authors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  className="bg-transparent outline-none px-2 w-full text-sm sm:text-base"
                />
              </form>
            </div>

            {/* Mobile search */}
            <div className="block sm:hidden">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full focus-within:ring-2 focus-within:ring-black transition"
              >
                <i className="fi fi-rr-search text-gray-500 text-lg"></i>
                <input
                  type="text"
                  placeholder="Search blogs or authors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none px-2 w-full text-sm"
                />
              </form>
            </div>

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
              >
                {searchResults.map((blog) => (
                  <li
                    key={blog.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => handleResultClick(blog.id)}
                  >
                    {blog.image_url && (
                      <Image
                        width={40}
                        height={40}
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-10 h-10 object-cover rounded"
                        unoptimized
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm sm:text-base">{blog.title}</span>
                      <span className="text-xs text-gray-500">{blog.author_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ===== Right Section ===== */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <button
            onClick={() => router.push("/blog-editor")}
            className="flex items-center gap-1 text-sm sm:text-base md:text-lg text-gray-800/70 hover:text-black"
          >
            <i className="fi fi-rr-edit"></i>
            <span>Write</span>
          </button>

          <div className="relative">
            <button
              className="text-xl text-gray-800/70 p-1 hover:text-black rounded-full transition"
              onClick={() => router.push("/notifications")}
            >
              <i className="fi fi-rr-bell"></i>
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          <button
            className="h-10 w-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center hover:opacity-90 transition"
            onClick={() => router.push(`/profile/${userData.userId}`)}
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
        </div>
      </header>
    </>
  );
}
