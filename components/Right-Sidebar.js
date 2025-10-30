"use client";
import React, { useState, useEffect } from "react";
import { Users, BookmarkPlus, UserPlus, UserCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MediumSidebar({ onCategorySelect, selectedCategory }) {
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(9);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");

  const loadMore = () => setVisibleCount((prev) => prev + 2);

  const topics = [
    "Technology","Health & Wellness","Travel","Food","Lifestyle",
    "Education","Finance","Entertainment","Science","Sports",
    "Music","Gaming","History","Art & Design","News & Politics", "Others"
  ];

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.success) {
          setSuggestedUsers(data.users);
          const alreadyFollowing = new Set(
            data.users.filter(user => user.is_following).map(user => user.user_id)
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

  // Fetch recommended blogs
  useEffect(() => {
    const fetchRecommendedBlogs = async () => {
      try {
        const res = await fetch("/api/blogs/recommended");
        const data = await res.json();
        if (data.success) {
          setRecommendedBlogs(data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch recommended blogs:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchRecommendedBlogs();
  }, []);

  // Calculate reading time
  const calculateReadTime = (content) => {
    if (!content) return "5 min read";
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const toggleFollow = async (userId, userName) => {
    try {
      const res = await fetch("/api/blogs/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: userId }),
      });

      const data = await res.json();
      if (data.success) {
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isFollowing) newSet.add(userId);
          else newSet.delete(userId);
          return newSet;
        });

        const action = data.isFollowing
          ? `You followed ${userName}`
          : `You unfollowed ${userName}`;

        setNotification(action);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else {
        alert(data.error || "Failed to follow user");
      }
    } catch (err) {
      console.error("Failed to follow user:", err);
      alert("Failed to follow user");
    }
  };

  const handleCategoryClick = (category) => {
    // Toggle category selection
    const newCategory = selectedCategory === category ? null : category;
    
    // Notify parent component
    if (onCategorySelect) {
      onCategorySelect(newCategory);
    }
  };

  return (
    <div className="space-y-8 pl-[2vh] relative">
      {/* Sliding Notification Popup */}
      <div
        className={`fixed top-[80px] left-1/2 transform -translate-x-1/2 z-[2000] bg-black text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 ${
          showNotification ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        {notification}
      </div>

      {/* Recommended Topics */}
      <div className="mt-[5vh]">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Discover more of what matters to you
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {topics.slice(0, visibleCount).map((topic) => (
            <button
              onClick={() => handleCategoryClick(topic)}
              key={topic}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === topic
                  ? "bg-black text-white font-semibold"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
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
        {selectedCategory && (
          <button
            onClick={() => handleCategoryClick(null)}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition mt-2"
          >
            Clear filter
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
                  onClick={() => toggleFollow(user.user_id, user.user_name)}
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
        {loadingBlogs ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : recommendedBlogs.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations available</p>
        ) : (
          <div className="space-y-5">
            {recommendedBlogs.map((blog) => (
              <div key={blog.id} className="group">
                <Link
                  href={`/blogs/${blog.id}`}
                  className="cursor-pointer block"
                >
                  <h4 className="font-medium text-gray-900 text-sm leading-snug mb-1 group-hover:text-black line-clamp-2">
                    {blog.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{blog.user_name}</span>
                    <span>·</span>
                    <span>{calculateReadTime(blog.content)}</span>
                  </div>
                </Link>
                
                {/* Recommendation Reason Badge */}
                {blog.reason && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                    <Sparkles size={12} />
                    <span className="font-medium">{blog.reason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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