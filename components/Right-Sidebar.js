"use client";

import React, { useState, useEffect } from "react";
import { Users, BookmarkPlus, UserPlus, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MediumSidebar() {
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(9);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadMore = () => setVisibleCount((prev) => prev + 2);

  const topics = [
    "Technology",
    "Health & Wellness",
    "Travel",
    "Food",
    "Lifestyle",
    "Education",
    "Finance",
    "Entertainment",
    "Science",
    "Sports",
    "Music",
    "Gaming",
    "History",
    "Art & Design",
    "News & Politics",
  ];

  const articles = [
    { id: 1, title: "The Future of Web Development in 2025", author: "John Doe", reads: "5 min read" },
    { id: 2, title: "How AI is Reshaping Creative Industries", author: "Jane Smith", reads: "8 min read" },
    { id: 3, title: "Building Better User Experiences", author: "Mike Johnson", reads: "6 min read" },
    { id: 4, title: "The Art of Clean Code", author: "Emily Davis", reads: "7 min read" },
  ];

  // Fetch suggested users to follow
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.success) {
          setSuggestedUsers(data.users);
          // Set initial follow status
          const alreadyFollowing = new Set(
            data.users
              .filter(user => user.is_following)
              .map(user => user.user_id)
          );
          setFollowedUsers(alreadyFollowing);
        }
      } catch (err) {
        console.error("Failed to fetch suggested users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const toggleFollow = async (userId) => {
    try {
      const res = await fetch("/api/blogs/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: userId })
      });

      const data = await res.json();
      if (data.success) {
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isFollowing) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      } else {
        alert(data.error || "Failed to follow user");
      }
    } catch (err) {
      console.error("Failed to follow user:", err);
      alert("Failed to follow user");
    }
  };

  return (
    <div className="space-y-8 pl-[2vh]">
      {/* Recommended Topics */}
      <div className="mt-[5vh]">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Discover more of what matters to you
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {topics.slice(0, visibleCount).map((topic) => (
            <button
              onClick={() => alert("Discovery placeholder")}
              key={topic}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
            >
              {topic}
            </button>
          ))}
        </div>
        {visibleCount < topics.length && (
          <button
            onClick={loadMore}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Load more
          </button>
        )}
      </div>

      {/* Who to Follow */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} />
          Who to follow
        </h3>
        {loadingUsers ? (
          <p className="text-sm text-gray-500">Loading suggestions...</p>
        ) : suggestedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No suggestions available</p>
        ) : (
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.user_id} className="flex items-start gap-3">
                <Link href={`/profile/${user.user_id}`}>
                  {user.profile_url ? (
                    <Image
                      src={user.profile_url}
                      alt={user.user_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {user.user_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.user_id}`}>
                    <h4 className="font-medium text-gray-900 text-sm truncate hover:underline">
                      {user.user_name}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-500 truncate line-clamp-2">
                    {user.bio || "No bio available"}
                  </p>
                </div>
                <button
                  onClick={() => toggleFollow(user.user_id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition flex-shrink-0 flex items-center gap-1 ${
                    followedUsers.has(user.user_id)
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {followedUsers.has(user.user_id) ? (
                    <>
                      <UserCheck size={14} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Reading */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookmarkPlus size={18} />
          Recommended reading
        </h3>
        <div className="space-y-5">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <h4 className="font-medium text-gray-900 text-sm leading-snug mb-1 group-hover:text-black line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.reads}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-900">Help</a>
          <a href="#" className="hover:text-gray-900">Status</a>
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Careers</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Text to speech</a>
          <a href="#" className="hover:text-gray-900">Teams</a>
        </div>
      </div>
    </div>
  );
}