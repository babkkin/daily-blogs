"use client";
import Link from "next/link"; // ✅ Add this import

export default function SettingsPage() {


  return (
    <div
      className={`h-131 flex items-center justify-center transition-colors duration-300 `}
    >
      <div
        className={`shadow-xl rounded-2xl w-full max-w-md p-6 transition-colors duration-300 border
        `}
      >

        <h1
          className={`text-2xl font-bold mb-6 transition-colors duration-300 
          `}
        >
          Settings
        </h1>

        <div
          className={`rounded-xl pl-2 transition-colors duration-200 border
          `}
        >
          <Link
            href="/profile"
            className={`transition-colors duration-200 flex items-center  h-12 rounded-full
           `}
          >
            Profile Information
          </Link>
        </div>

        <div  
          className={`rounded-xl pl-2 transition-colors duration-200 
          `}
        >

        </div>

        <div
          className={`rounded-xl pl-2 transition-colors duration-200 border 
          `}
        >
          <Link
            href="/Newsfeed"
            className={`transition-colors duration-200 flex items-center  h-12 rounded-full
            `}
          >
            Post
          </Link>
        </div>
      </div>
    </div>
  );
}
