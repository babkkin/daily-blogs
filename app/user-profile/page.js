"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import EditBio from "@/components/Editbio";

export default function MediumStyleProfile() {
  const [activeTab, setActiveTab] = useState("home");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data.success) {
          setName(data.user.name);
          setBio(data.user.bio || "");
          setPhoto(data.user.profile_url || null);
        } else {
          console.error("Failed to load user info:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blogs/user");
        const data = await res.json();
        if (data.success) {
          setPosts(data.blogs);
        } else {
          console.error("Failed to load posts:", data.error);
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleBioSave = (newBio) => {
    setBio(newBio);
  };

  return (
    <div className="flex min-h-screen bg-white text-black justify-center">
      <main className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-8">
        {/* ===== User Info ===== */}
        <div className="flex flex-col items-center text-center mb-10">
          {photo ? (
            <Image
              src={photo}
              alt="Profile"
              width={128}
              height={128}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
              unoptimized
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-gray-200">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold mt-4">{name || "Unnamed User"}</h2>
        </div>

        {/* ===== Tabs ===== */}
        <div className="border-b flex flex-wrap justify-center gap-6 sm:gap-10 text-base sm:text-lg font-medium mb-8 cursor-pointer">
          <button
            className={`pb-2 ${
              activeTab === "home" ? "border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`pb-2 ${
              activeTab === "about" ? "border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {/* ===== Home Tab ===== */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-6 sm:gap-8">
            {loading ? (
              <p className="text-gray-500 text-center">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500 text-center">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.id}`}
                  className="group flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8 rounded-xl p-4 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">
                      Published on {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-black transition-colors break-words">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-1 line-clamp-2 break-words">
                      {post.subtitle || "No subtitle provided."}
                    </p>
                  </div>

                  {post.image_url && (
                    <div className="w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                </Link>
              ))
            )}
          </div>
        )}

        {/* ===== About Tab ===== */}
        {activeTab === "about" && (
          <div className="mt-8 sm:mt-10 px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h3 className="text-lg sm:text-xl font-bold">About</h3>
              <button
                onClick={() => setIsEditBioOpen(true)}
                className="px-4 py-2 bg-black text-white text-sm sm:text-base rounded-md hover:bg-gray-800 transition"
              >
                Edit Bio
              </button>
            </div>

            {!bio ? (
              <p className="text-gray-700 text-sm sm:text-base mb-4">No bio yet.</p>
            ) : (
              <p className="text-gray-700 text-sm sm:text-base mb-4">{bio}</p>
            )}
          </div>
        )}
      </main>

      {/* ===== Edit Bio Modal ===== */}
      <EditBio
        isOpen={isEditBioOpen}
        onClose={() => setIsEditBioOpen(false)}
        currentBio={bio}
        onSave={handleBioSave}
      />
    </div>
  );
}
