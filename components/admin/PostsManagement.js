"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Eye, Edit } from "lucide-react";

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        alert("Post deleted successfully");
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Manage Posts</h3>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="trash">Trash</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No posts found</p>
      ) : (
        
        <div className="space-y-4">
                  <p className="text-gray-700">View, edit, or delete posts here.</p>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:shadow-md transition flex gap-4"
            >
              {post.image_url && (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded"
                  unoptimized
                />
              )}

              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  By {post.user_name} • {new Date(post.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2 items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.claps_count || 0} claps • {post.comments_count || 0} comments
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/blogs/${post.id}`}
                  className="p-2 hover:bg-gray-100 rounded transition"
                  title="View"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/blog-editor/${post.id}`}
                  className="p-2 hover:bg-blue-100 rounded transition"
                  title="Edit"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}