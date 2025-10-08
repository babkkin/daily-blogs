"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

export default function MediumStyleProfile() {
  const [activeTab, setActiveTab] = useState("home");
  const [name, setName] = useState("Digong");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, pronouns }),
    });
    setIsEditing(false);
  };

  // Fetch user posts from your "my-posts" API (using JWT session)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/my-blog");
        const data = await res.json();
        if (data.success) setPosts(data.blogs);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
      [id]: [...(prev[id] || []), { user: "You", text }],
    }));
    setNewComments((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="flex min-h-screen bg-white text-black justify-center">
      <main className="w-full max-w-3xl p-8">
        {/* User Info */}
        <div className="flex flex-col items-center mb-10">
          {photo ? (
            <Image
              src={photo}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border"
              unoptimized
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {name.charAt(0)}
            </div>
          )}
          <h2 className="text-3xl font-bold mt-4">{name}</h2>
        </div>

        {/* Tabs */}
        <div className="border-b flex justify-center gap-10 text-lg font-medium mb-8 cursor-pointer">
          <button
            className={`pb-2 ${
              activeTab === "home"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`pb-2 ${
              activeTab === "about"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {/* Home Tab: Posts */}
        {activeTab === "home" && (
          <div className="space-y-10">
            {loading ? (
              <p className="text-gray-500 text-center">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500 text-center">No posts yet.</p>
            ) : (
              posts.map((post, index) => (
                <div key={post.title + post.created_at} className="border-b border-gray-300 pb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                  <p className="text-sm text-gray-500 mb-4">
                    Published on {new Date(post.created_at).toLocaleDateString()}
                  </p>

                  {post.image_url && (
                    <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-6">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="object-cover w-full h-auto"
                      />
                    </div>
                  )}

                  <div
                    className="prose max-w-none text-gray-800 mb-8"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Like & Comments */}
                  <div className="border-t border-gray-300 pt-4">
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
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="mt-10">
            {!isEditing ? (
              <div>
                <p className="text-gray-700 mb-4">
                  {bio || "No bio yet. Click edit to add one."}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 border rounded-full hover:bg-gray-50"
                >
                  Edit About
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Profile editing form remains unchanged */}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
