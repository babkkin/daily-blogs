"use client";
import Image from "next/image";
import { useDarkMode } from "../DarkModeContext";

export default function ProfileDashboard() {
  const { darkMode } = useDarkMode();

  const user = {
    name: "Ivan Sambat",
    role: "Full Stack Developer",
    bio: "I love building full-stack applications and exploring new technologies. Currently working on DailyBlogs with my team.",
    img: "/team/member1.jpg",
    location: "Laguna, Philippines",
    joined: "January 2024",
  };

  return (
    <div
      className={`px-6 md:px-20 lg:px-40 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <Image
          src={user.img}
          alt="Profile Picture"
          width={160}
          height={160}
          className="rounded-full object-cover shadow-xl"
        />
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {user.name}
          </h1>
          <p
            className={`text-lg mb-2 ${
              darkMode ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {user.role}
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            📍 {user.location} • 🗓 Joined {user.joined}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <h2
          className={`text-2xl font-semibold mb-3 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          About Me
        </h2>
        <p
          className={`text-lg leading-relaxed ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          {user.bio}
        </p>
      </div>

      {/* Settings Section */}
      <div className="mb-8">
        <h2
          className={`text-2xl font-semibold mb-3 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Settings
        </h2>
        <div className="space-y-4">
          <button
            className={`w-full text-left px-4 py-3 rounded-xl shadow-md transition ${
              darkMode
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            Edit Profile
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-xl shadow-md transition ${
              darkMode
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            Account Settings
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-xl shadow-md transition ${
              darkMode
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            Privacy & Security
          </button>
        </div>
      </div>

      {/* Activity Section */}
      <div>
        <h2
          className={`text-2xl font-semibold mb-3 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Recent Activity
        </h2>
        <ul
          className={`space-y-2 ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          <li>📝 Posted a new blog: "How I Learned Full Stack Development"</li>
          <li>💬 Commented on Paul's post</li>
          <li>⭐ Liked Jhune's article about databases</li>
        </ul>
      </div>
    </div>
  );
}
