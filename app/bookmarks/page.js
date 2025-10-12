"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/api/blogs/bookmarks/list");
        const data = await res.json();
        if (data.success) setBookmarks(data.bookmarks);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (blogId) => {
    try {
      const res = await fetch("/api/blogs/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });
      const data = await res.json();
      if (data.success && !data.isBookmarked) {
        setBookmarks((prev) => prev.filter((b) => b.blog_id !== blogId));
      }
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-center text-gray-500 text-base sm:text-lg">
          Loading bookmarks...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Your Bookmarks
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {bookmarks.length} saved{" "}
          {bookmarks.length === 1 ? "article" : "articles"}
        </p>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-16 px-4">
          <Bookmark size={56} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            No bookmarks yet
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Save articles you want to read later by clicking the bookmark icon
          </p>
          <Link
            href="/home"
            className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Explore Blogs
          </Link>
        </div>
      ) : (
        // Responsive grid
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.blog_id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group bg-white"
            >
              <Link href={`/blogs/${bookmark.blog_id}`}>
                {bookmark.image_url ? (
                  <div className="relative w-full h-40 sm:h-48 md:h-52">
                    <Image
                      src={bookmark.image_url}
                      alt={bookmark.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-3xl sm:text-4xl">📝</span>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/blogs/${bookmark.blog_id}`}>
                  <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 hover:text-gray-600 transition">
                    {bookmark.title}
                  </h2>
                </Link>

                {bookmark.subtitle && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {bookmark.subtitle}
                  </p>
                )}

                {/* Author and remove button */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {bookmark.author_profile_url ? (
                      <Image
                        src={bookmark.author_profile_url}
                        alt={bookmark.author_name}
                        width={24}
                        height={24}
                        className="rounded-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {bookmark.author_name?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 truncate">
                      {bookmark.author_name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(bookmark.blog_id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    title="Remove bookmark"
                  >
                    <Bookmark
                      size={20}
                      fill="currentColor"
                      className="text-yellow-500"
                    />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Saved on{" "}
                  {new Date(bookmark.bookmarked_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
