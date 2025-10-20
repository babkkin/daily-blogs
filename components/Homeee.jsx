"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";

export default function HomePage({ selectedCategory, onClearCategory }) {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedTab, setFeedTab] = useState("latest");

  const options = { year: "numeric", month: "short", day: "numeric" };

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError("");

      try {
        let endpoint = `/api/blogs?feed=${feedTab}`;

        if (selectedCategory) {
          endpoint += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();

        if (data.success) {
          setBlogs(data.blogs);
        } else {
          setError(data.error || "Server returned an error.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [feedTab, selectedCategory]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-t-black border-gray-300 rounded-full animate-spin mx-auto" />
          <p className="text-xl font-semibold">Almost There...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-10 sm:py-16">
      <h1 className="font-semibold text-xl sm:text-2xl mb-6 text-gray-900 pb-3">
        For you {selectedCategory && `- ${selectedCategory}`}
      </h1>

      {/* Category Filter */}
      {selectedCategory && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtering by:</span>
          <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
            {selectedCategory}
          </span>
          <button
            onClick={onClearCategory}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Feed Tabs */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          className={`pb-3 text-base sm:text-lg transition ${
            feedTab === "latest"
              ? "border-b-2 border-black font-semibold text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFeedTab("latest")}
        >
          Latest
        </button>
        <button
          className={`pb-3 text-base sm:text-lg transition ${
            feedTab === "trending"
              ? "border-b-2 border-black font-semibold text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFeedTab("trending")}
        >
          Trending
        </button>
        {session && (
          <button
            className={`pb-3 text-base sm:text-lg transition ${
              feedTab === "following"
                ? "border-b-2 border-black font-semibold text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFeedTab("following")}
          >
            Following
          </button>
        )}
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          {feedTab === "following"
            ? "No posts from people you follow yet."
            : selectedCategory
            ? `No posts found in the ${selectedCategory} category.`
            : "No posts available yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="group flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-8 hover:bg-gray-50 transition-all rounded-xl p-4"
            >
              {/* Left Side */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1 mt-3 sm:mt-4">
                  by <span className="text-gray-700 font-semibold">{blog.user_name}</span>
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 group-hover:text-black transition-colors break-words">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-lg sm:text-xl mt-1 line-clamp-2 break-words">
                  {blog.subtitle || "No description provided."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-3">
                  <p className="text-gray-400 text-sm">
                    {new Date(blog.created_at).toLocaleDateString("en-US", options)}
                  </p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={16} /> {blog.claps_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} /> {blog.comments_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark size={16} /> {blog.bookmarks_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              {blog.image_url && (
                <div className="w-full sm:w-48 md:w-56 h-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
