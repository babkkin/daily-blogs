"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [claps, setClaps] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch blog, claps, and comments
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch blog
        const blogRes = await fetch(`/api/blogs/single-blog?id=${id}`);
        const blogData = await blogRes.json();
        if (!blogData.success) throw new Error(blogData.error || "Failed to fetch blog");
        setBlog(blogData.blog);

        // Fetch comments
        const commentsRes = await fetch(`/api/blogs/comments?blogId=${id}`);
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments || []);

        // Fetch claps
        const clapsRes = await fetch(`/api/blogs/claps?blogId=${id}`);
        const clapsData = await clapsRes.json();
        setClaps(clapsData.claps || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle claps
  const handleClap = async () => {
    try {
      const res = await fetch("/api/blogs/claps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: id }) // userId is handled in backend via JWT
      });
      const data = await res.json();
      if (data.success) setClaps(data.claps);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch("/api/blogs/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: id, text: newComment }) // userId removed
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setNewComment("");
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blog) return <div>No blog found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/home" className="text-emerald-600 hover:underline mb-4 block">← Back to Blogs</Link>

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{new Date(blog.created_at).toLocaleDateString()}</p>

      {blog.image_url && (
        <div className="relative w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden">
          <Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
        </div>
      )}

      <div className="text-gray-800 text-lg mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Clap */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleClap} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
          <Heart size={20} fill={claps > 0 ? "currentColor" : "none"} strokeWidth={2} />
          <span>{claps}</span>
        </button>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button type="submit" className="mt-2 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2">
            <MessageCircle size={18} /> Post Comment
          </button>
        </form>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.comment_id} className="border p-3 rounded bg-gray-50">
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
