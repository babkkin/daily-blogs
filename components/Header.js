"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import SignOut from "@/components/SignOut";
import Image from "next/image";
import {Menu,Search,SquarePen,Bell,Compass,MoveUpRight,User} from "lucide-react"

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ authors: [], blogs: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

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

  // Close Search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchDropdown]);

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

  // Fetch search results live (enhanced with authors and blogs)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ authors: [], blogs: [] });
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/blogs/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          // Assuming your API returns both authors and blogs
          // If not, you'll need to update your API endpoint
          setSearchResults({
            authors: data.authors || [],
            blogs: data.blogs || []
          });
          setShowDropdown(true);
          // Close discovery dropdown when search results appear
          setShowSearchDropdown(false);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [searchQuery]);

  // Close results dropdown if clicking outside
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
      setSearchResults({ authors: [], blogs: [] });
      setShowDropdown(false);
    }
  };

  const handleBlogClick = (id) => {
    router.push(`/blogs/${id}`);
    setSearchQuery("");
    setSearchResults({ authors: [], blogs: [] });
    setShowDropdown(false);
  };

  const handleAuthorClick = (userId) => {
    router.push(`/profile/${userId}`);
    setSearchQuery("");
    setSearchResults({ authors: [], blogs: [] });
    setShowDropdown(false);
  };

  const handleInputClick = () => {
    // If there are existing results, show them
    if (searchResults.authors.length > 0 || searchResults.blogs.length > 0) {
      setShowDropdown(true);
    } else {
      // Show discovery dropdown only if no search query
      if (searchQuery.trim() === "") {
        setShowSearchDropdown(!showSearchDropdown);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Close discovery dropdown when typing
    if (e.target.value.trim() !== "") {
      setShowSearchDropdown(false);
    }
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
            className="text-xl p-1 text-gray-800/70 rounded-md hover:text-black transition mt-1"
          >
            <Menu size={18} className="text-xl flex-shrink-0" />
          </button>

          <Link href="/home" className="text-2xl md:text-3xl lg:text-4xl font-semibold whitespace-nowrap mr-[1vh]">
            <h1>DailyBlogs</h1>
          </Link>

          {/* ===== Search Section ===== */}
          <div className="relative flex-1" ref={searchDropdownRef}>
            {/* Desktop search */}
            <div className="hidden sm:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-100/30 rounded-full px-3 py-3 w-[250px] focus-within:ring-1 focus-within:ring-black transition text-gray-800/70 hover:text-black"
              >
                <Search size={18} />
                <input
                  onClick={handleInputClick}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none px-2 w-full text-sm sm:text-base"
                />
              </form>
            </div>

            {/* Mobile search */}
            <div className="block sm:hidden">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-gray-100/30 rounded-full px-3 py-2 w-full focus-within:ring-1 focus-within:ring-black transition"
              >
                <Search size={18} className="text-gray-500" />
                <input
                  onClick={handleInputClick}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="bg-transparent outline-none px-2 w-full text-sm"
                />
              </form>
            </div>

            {/* Discovery Dropdown - Shows when clicking search (no query) */}
            {showSearchDropdown && (
              <div className="absolute left-0 mt-2 w-80 pt-8 pb-8 pl-5 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link
                  href="#"
                  onClick={() => { 
                    setShowSearchDropdown(false);
                    alert("Discovery Placeholder");
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-black transition w-full"
                >
                  <div className="flex items-center justify-between w-full px-3 py-1 text-gray-800/70 hover:text-black">
                    <div className="flex items-center gap-2">
                      <Compass size={18} className="flex-shrink-0" />
                      <p className="text-sm">Explore Discovery</p>
                    </div>
                    <MoveUpRight size={16} className="flex-shrink-0 mr-3" />
                  </div>
                </Link>
              </div>
            )}

            {/* Enhanced Search Results Dropdown - Shows when typing */}
            {showDropdown && (searchResults.authors.length > 0 || searchResults.blogs.length > 0) && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 bg-white border mt-1 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50"
              >
                {/* Authors Section */}
                {searchResults.authors.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-3 py-2 bg-gray-50 flex items-center gap-2">
                      <User size={16} className="text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">Authors</span>
                    </div>
                    <ul>
                      {searchResults.authors.map((author) => (
                        <li
                          key={author.userId}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                          onClick={() => handleAuthorClick(author.userId)}
                        >
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center flex-shrink-0">
                            {author.profile_url ? (
                              <Image
                                src={author.profile_url}
                                alt={author.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-white text-sm font-bold">
                                {author.name ? author.name.charAt(0).toUpperCase() : "U"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{author.name}</span>
                            {author.bio && (
                              <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                {author.bio}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Blogs Section */}
                {searchResults.blogs.length > 0 && (
                  <div>
                    <div className="px-3 py-2 bg-gray-50 flex items-center gap-2">
                      <SquarePen size={16} className="text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">Blogs</span>
                    </div>
                    <ul>
                      {searchResults.blogs.map((blog) => (
                        <li
                          key={blog.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => handleBlogClick(blog.id)}
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
                  </div>
                )}
              </div>
            )}

            {/* No Results Message */}
            {showDropdown && searchQuery.trim() !== "" && 
             searchResults.authors.length === 0 && searchResults.blogs.length === 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 bg-white border mt-1 rounded-md shadow-lg p-4 z-50"
              >
                <p className="text-center text-gray-500 text-sm">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Right Section ===== */}
        {/* BLOG WRITING*/}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-8">
          <button
            onClick={() => router.push("/blog-editor")}
            className="flex items-center gap-1 text-sm sm:text-base md:text-lg text-gray-800/70 hover:text-black"
          >
            <SquarePen className="fi fi-rr-edit text-2xl mt-1 mr-1.5"/>
            <span>Write</span>
          </button>

          {/* Notifications*/}
          <div className="relative">
            <button
              className="text-xl text-gray-800/70 p-1  mt-1 hover:text-black rounded-full transition"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="text-2xl"/>
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative profile-dropdown-container">
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
              <div className="absolute right-0 mt-2 w-64 p-2 bg-white border  border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
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
                  <div className="text-left">
                    <p className="font-medium text-sm">{userData?.name || "User"}</p>
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
                  <i className="fi fi-rr-settings text-xl"></i>
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
                  <i className="fi fi-rr-interrogation text-xl"></i>
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