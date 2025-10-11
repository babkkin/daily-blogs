"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Trash2, Edit2, X, Check } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BlogPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

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
        setHasClapped(clapsData.hasClapped || false);
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
        body: JSON.stringify({ blogId: id })
      });
      const data = await res.json();
      if (data.success) {
        setClaps(data.claps);
        setHasClapped(data.hasClapped);
      } else {
        alert(data.error || "Failed to clap");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to clap");
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
        body: JSON.stringify({ blogId: id, text: newComment })
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment("");
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/blogs/comments?commentId=${commentId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c.comment_id !== commentId));
      } else {
        alert(data.error || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  // Handle edit comment
  const startEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditingText(comment.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch("/api/blogs/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text: editingText })
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.map(c => 
          c.comment_id === commentId ? { ...c, text: editingText } : c
        ));
        cancelEdit();
      } else {
        alert(data.error || "Failed to update comment");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blog) return <div>No blog found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/home" className="text-emerald-600 hover:underline mb-4 block">
        ← Back to Blogs
      </Link>

      <h1 className="text-4xl font-bold mb-4 break-words">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-2 break-words italic">{blog.subtitle}</p>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>

      {blog.image_url && (
        <div className="relative w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden">
          <Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="text-gray-800 text-lg mb-8 break-words prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Clap */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleClap}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            hasClapped 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          <Heart size={20} fill={hasClapped ? "currentColor" : "none"} strokeWidth={2} />
          <span>{claps}</span>
        </button>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>

        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder={session ? "Write a comment..." : "Please login to comment"}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            maxLength={500}
            disabled={!session}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">{newComment.length}/500 characters</p>
            <button
              type="submit"
              className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newComment.trim() || !session}
            >
              <MessageCircle size={18} /> Post Comment
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.comment_id} className="border border-gray-200 p-4 rounded-lg bg-white">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {c.profile_url ? (
                      <Image
                        src={c.profile_url}
                        alt={c.user_name || "User"}
                        width={40}
                        height={40}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {c.user_name ? c.user_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* User name and timestamp */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{c.user_name || "Anonymous"}</p>
                        <p className="text-xs text-gray-500">{timeAgo(c.created_at)}</p>
                      </div>

                      {/* Edit/Delete buttons - only show if it's the user's comment */}
                      {session?.user?.id === c.user_id && (
                        <div className="flex gap-2">
                          {editingCommentId !== c.comment_id && (
                            <>
                              <button
                                onClick={() => startEditComment(c)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c.comment_id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Comment text or edit form */}
                    {editingCommentId === c.comment_id ? (
                      <div>
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows={3}
                          maxLength={500}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditComment(c.comment_id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Check size={16} /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center gap-1"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 break-words">{c.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}