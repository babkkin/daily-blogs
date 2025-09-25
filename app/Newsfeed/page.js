"use client";
import React, { useState } from "react";
import { useDarkMode } from "../DarkModeContext";
import Link from "next/link";

export default function NewsfeedPage() {
  const { darkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`border-r transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-56" : "w-16"
        } ${darkMode ? "border-gray-700" : "border-gray-300"}`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-3 flex justify-center items-center hover:bg-gray-700 transition-colors ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 p-3">
          <Link
            href="/Newsfeed"
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
              darkMode ? "hover:text-white" : "hover:bg-gray-100"
            }`}
          >
            🏠 {sidebarOpen && "Home"}
          </Link>

          <Link
            href="/profile"
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
              darkMode ? "hover:text-white" : "hover:bg-gray-100"
            }`}
          >
            👤 {sidebarOpen && "Profile"}
          </Link>

          <Link
            href="/blog-editor"
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
              darkMode ? "hover:text-white" : "hover:bg-gray-100"
            }`}
          >
            ✍️ {sidebarOpen && "Write"}
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        <PostGrid />
      </main>

      {/* OPTIONAL RIGHT SIDEBAR (Like Medium’s “Recommended Topics”) */}
      <aside
        className={`hidden lg:block w-64 p-4 border-l transition-colors duration-300 ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Recommended topics</h2>
        <div className="flex flex-wrap gap-2">
          {["Technology", "Writing", "Self Improvement", "Machine Learning", "Politics", "Cryptocurrency"].map(
            (topic) => (
              <span
                key={topic}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-300 
                ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                {topic}
              </span>
            )
          )}
        </div>
      </aside>
    </div>
  );
}

function PostGrid() {
  const { darkMode } = useDarkMode();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((post, index) => (
        <div
          key={index}
          className={`shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col
          ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <img
            src="https://via.placeholder.com/300x200"
            alt="Post"
            className="w-full h-40 object-cover"
          />
          <div className="p-3 flex flex-col flex-grow">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Post Title
            </h3>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              This is where the user's thoughts or caption will go.
            </p>
          </div>

          {/* Like & Comment Buttons */}
          <div
            className={`flex justify-between px-3 py-2 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button className={`${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              👍 Like
            </button>
            <button className={`${darkMode ? "hover:text-blue-400" : "hover:text-blue-600"}`}>
              💬 Comment
            </button>
          </div>

          {/* Comment Input */}
          <div
            className={`border-t p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className={`w-full rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-black placeholder-gray-500"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
