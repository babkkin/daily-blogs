"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", { cache: "no-store" });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        if (data.success) {
          setBlogs(data.blogs);
        } else {
          setError("Server returned an error.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto w-[90%] overflow-hidden drop-shadow-2xl">
          <div className="flex p-8 justify-center items-center h-[350px] sm:h-[450px]">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-t-[#101010] border-[#dfdfdf] rounded-full animate-spin mx-auto" />
              <div className="text-[#000000] font-semibold text-3xl sm:text-4xl opacity-90 animate-fadeIn">
                Almost There...
              </div>
              <div className="text-black text-sm opacity-80 animate-fadeIn">
                <p>We're getting everything ready for you...</p>
                <p>Sit tight for just a moment.</p>
              </div>
            </div>
          </div>
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
      <h1 className="font-semibold text-2xl sm:text-3xl mb-6 text-gray-900 border-b border-gray-200 pb-3">
        For you
      </h1>

      <div className="flex flex-col gap-10">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="group flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-8 hover:bg-gray-50 transition-all rounded-xl p-4"
          >
            {/* Left Side: Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1 mt-3 sm:mt-4">
                In{" "}
                <span className="font-medium text-gray-700">
                  Data Science Collective
                </span>{" "}
                by{" "}
                <span className="text-gray-700 font-semibold">
                  {blog.user_name}
                </span>
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-black transition-colors break-words">
                {blog.title}
              </h2>

              <p className="text-gray-600 text-lg sm:text-xl mt-1 line-clamp-2 break-words">
                {blog.subtitle || "No description provided."}
              </p>

              <div className="flex items-center gap-4 mt-3">
                <p className="text-gray-400 text-sm">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {blog.claps_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    {blog.comments_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark size={16} />
                    {blog.bookmarks_count || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Thumbnail */}
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
    </div>
  );
}