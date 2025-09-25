"use client";

import { useDarkMode } from "@/DarkModeContext";

export default function BlogPost({ params }) {
  const { darkMode } = useDarkMode();

  // Simulated post content based on slug
  const posts = {
    "hello-world": {
      title: "Hello World",
      content: "This is the first post in your blog!",
    },
    "nextjs-guide": {
      title: "Getting Started with Next.js",
      content: "This is a guide to help you start with Next.js.",
    },
  };

  const post = posts[params.slug];

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center 
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <h1 className="text-2xl font-bold">Post Not Found</h1>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-8 py-6 
      ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="mb-6">{post.content}</p>

      {/* Comments + Like Section */}
      <div className={`mt-6 p-4 rounded-xl shadow-md border 
        ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"}`}>
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <textarea
          className={`w-full rounded-md p-2 mb-3 resize-none border 
            ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
          rows="3"
          placeholder="Write a comment..."
        />
        <button className={`px-4 py-2 rounded-md font-medium 
          ${darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
          Post Comment
        </button>

        {/* Simple Like Button */}
        <button className={`ml-4 px-4 py-2 rounded-md font-medium 
          ${darkMode ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-600 hover:bg-pink-700"} text-white`}>
          ❤️ Like
        </button>
      </div>
    </div>
  );
}
