"use client";
import { useState, useEffect } from "react";
import InteractiveGridPattern from "@/components/ui/interactive-grid-pattern";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

export default function BlogPostPage() {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success) setBlogs(data.blogs);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] - 1 : 1,
    }));
  };

  const handleCommentSubmit = (id, e) => {
    e.preventDefault();
    const text = newComments[id]?.trim();
    if (!text) return;
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { user: "Anonymous", text }],
    }));
    setNewComments((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden bg-white">
      <InteractiveGridPattern className="absolute inset-0 -z-10 h-full w-full skew-y-12 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]" />

      <div className="z-10 w-full max-w-3xl px-6 md:px-16 py-16 space-y-16">
        {blogs.length === 0 ? (
          <p className="text-gray-500 italic text-center">No blog posts yet.</p>
        ) : (
          blogs.map((blog, index) => (
            <div key={index} className="border-b border-gray-300 pb-10">
              {/* Blog Header */}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{blog.title}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Published on {new Date(blog.created_at).toLocaleDateString()}
              </p>

              {/* Blog Thumbnail */}
              {blog.image_url && (
                <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-6">
                  <Image
                    src={blog.image_url}
                    alt="Thumbnail"
                    width={800}
                    height={400}
                    className="object-cover w-full h-auto"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div
                className="prose max-w-none text-gray-800 mb-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Like & Comments */}
              <div className="border-t border-gray-300 pt-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(index)}
                  className={`flex items-center gap-2 text-lg font-medium transition-colors duration-200 ${
                    likes[index] ? "text-red-600" : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  <Heart
                    size={22}
                    fill={likes[index] ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                  <span>{likes[index] || 0} {likes[index] === 1 ? "Like" : "Likes"}</span>
                </button>

                {/* Comment Form */}
                <form onSubmit={(e) => handleCommentSubmit(index, e)} className="mt-4">
                  <textarea
                    value={newComments[index] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({ ...prev, [index]: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-2xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Write a comment..."
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="mt-2 flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    <MessageCircle size={18} />
                    Post Comment
                  </button>
                </form>

                {/* Comments */}
                <div className="mt-4 space-y-3">
                  {(comments[index] || []).map((c, i) => (
                    <div key={i} className="border border-gray-200 rounded-2xl p-3 bg-gray-50">
                      <p className="font-medium text-gray-900">{c.user}</p>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
