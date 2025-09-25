"use client";
import { useDarkMode } from "../DarkModeContext";
import Link from "next/link"; // ✅ Add this import

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`h-131 flex items-center justify-center transition-colors duration-300 
      ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <div
        className={`shadow-xl rounded-2xl w-full max-w-md p-6 transition-colors duration-300 border
        ${darkMode ? "border-white bg-gray-800" : "border-black bg-white"}`}
      >

        <h1
          className={`text-2xl font-bold mb-6 transition-colors duration-300 
          ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Settings
        </h1>

        <div
          className={`rounded-xl pl-2 transition-colors duration-200 border
          ${darkMode 
            ? "border-transparent hover:border-white text-white bg-[#3a4b63]" 
            : "border-transparent hover:border-black text-black bg-[#e7e7e7]"}`}
        >
          <Link
            href="/profile"
            className={`transition-colors duration-200 flex items-center  h-12 rounded-full
            ${darkMode ? "text-white bg-[#3a4b63]" : "text-black"}`}
          >
            Profile Information
          </Link>
        </div>

        <div  
          className={`rounded-xl pl-2 transition-colors duration-200 
          ${darkMode ? "text-white bg-[#3a4b63]" : "text-black bg-[#e7e7e7]"}`}
        >
          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-2 rounded-xl mt-2">
            <span
              className={`transition-colors duration-300
              ${darkMode ? "text-gray-200" : "text-black-700"}`}
            >
              Enable Dark Mode
            </span>
            <div
              className={`transition-all duration-300 rounded-full h-12 w-12
              ${darkMode 
                ? "bg-[#3a4b63] text-white hover:bg-[#c9c9c9]" 
                : "bg-white text-black hover:bg-[#d1d1d1]"}`} 
            >

                <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="w-6 h-6 cursor-pointer mt-3 ml-3"
              />
            </div> 
          </div>
        </div>

        <div
          className={`rounded-xl pl-2 transition-colors duration-200 border 
          ${darkMode 
            ? "border-transparent hover:border-white text-white bg-[#3a4b63]" 
            : "border-transparent hover:border-black text-black bg-[#e7e7e7]"}`}
        >
          <Link
            href="/Newsfeed"
            className={`transition-colors duration-200 flex items-center  h-12 rounded-full
            ${darkMode ? "text-white bg-[#3a4b63]" : "text-black"}`}
          >
            Post
          </Link>
        </div>
      </div>
    </div>
  );
}
