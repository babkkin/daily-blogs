"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import EditBio from "@/components/Editbio";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react";

export default function MediumStyleProfile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("home");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { id } = useParams();
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");
  const [manageTab, setManageTab] = useState("draft");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const currentUserId = session?.user?.userId || session?.user?.id;
  const isOwnProfile = currentUserId === profileUserId;

  const draftPosts = posts.filter(post => post.status === "draft");
  const trashPosts = posts.filter(post => post.status === "trash");
  const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        const data = await res.json();
        if (data.success) {
          setName(data.user.name);
          setBio(data.user.bio || "");
          setPhoto(data.user.profile_url || null);
          setProfileUserId(data.user.userId);
        } else {
          console.error("Failed to load user info:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch posts
 useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch all user posts with counts in a single query
      const res = await fetch(`/api/blogs/user/${id}`);
      const data = await res.json();

      if (data.success) {
        // Posts now already include claps_count, comments_count, bookmarks_count
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

  if (id) fetchPosts();
}, [id]);


  // Check follow status
  useEffect(() => {
    if (!currentUserId || !profileUserId || currentUserId === profileUserId) return;

    const checkFollow = async () => {
      try {
        const res = await fetch(`/api/blogs/user/follow?authorId=${profileUserId}`);
        const data = await res.json();
        if (data.success) setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Failed to check follow status:", err);
      }
    };

    checkFollow();
  }, [currentUserId, profileUserId]);

  const handleFollowToggle = async () => {
    if (!profileUserId) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/blogs/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: profileUserId }),
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
        const action = data.isFollowing ? `You followed ${name}` : `You unfollowed ${name}`;
        setNotification(action);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else {
        console.error("Follow action failed:", data.error);
      }
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBioSave = (newBio) => setBio(newBio);

  const handleMoveToTrash = async (postId) => {
    setOpenDropdown(null);
    try {
      const res = await fetch(`/api/blogs/${postId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "trash" }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: "trash" } : p));
        setNotification("Post moved to trash");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else {
        alert(data.error || "Failed to move to trash");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to move to trash");
    }
  };

  const handleMoveToDraft = async (postId) => {
    setOpenDropdown(null);
    try {
      const res = await fetch(`/api/blogs/${postId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "draft" }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: "draft" } : p));
        setNotification("Post moved to drafts");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else {
        alert(data.error || "Failed to move to draft");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to move to draft");
    }
  };

  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
    setOpenDropdown(null);
  };

  const performDelete = async () => {
    if (!postToDelete) return;

    setShowDeleteConfirm(false);

    try {
      const res = await fetch(`/api/blogs/${postToDelete}`, { method: "DELETE" });
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postToDelete));
        setNotification("Post deleted permanently");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } else {
        setNotification(data.error || "Failed to delete post");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to delete post");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }

    setPostToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-white text-black justify-center">
      {/* Sliding Notification Popup */}
      <div
        className={`fixed top-[80px] left-1/2 transform -translate-x-1/2 z-[2000] bg-black text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 ${
          showNotification ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        {notification}
      </div>

      <main className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-8">
        {/* User Info */}
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
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-400 to-pink-600  flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-gray-200">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold mt-4">{name || "Unnamed User"}</h2>

          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={isProcessing}
              className={`mt-3 px-5 py-2 rounded-md text-sm sm:text-base font-medium transition 
                ${isFollowing ? "bg-gray-200 text-black hover:bg-gray-300" : "bg-black text-white hover:bg-gray-800"}
              `}
            >
              {isProcessing ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b flex flex-wrap justify-center gap-6 sm:gap-10 text-base sm:text-lg font-medium mb-8 cursor-pointer">
          <button
            className={`pb-2 ${activeTab === "home" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>

          {isOwnProfile && (
            <button
              className={`pb-2 ${activeTab === "managepost" ? "border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("managepost")}
            >
              Manage Post
            </button>
          )}

          <button
            className={`pb-2 ${activeTab === "about" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-6 sm:gap-8">
            {loading ? (
              <p className="text-gray-500 text-center">Loading posts...</p>
            ) : posts.filter(post => post.status === "published").length === 0 ? (
              <p className="text-gray-500 text-center">No posts yet.</p>
            ) : (
              posts
                .filter(post => post.status === "published")
                .map((post) => (
                  <div key={post.id} className="relative">
                    <Link
                      href={`/blogs/${post.id}`}
                      className="group flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8 rounded-xl p-4 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">
                          Published on {new Date(post.created_at).toLocaleDateString("en-US", options)}
                        </p>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-black transition-colors break-words">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base mt-1 line-clamp-2 break-words">
                          {post.subtitle || "No subtitle provided."}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart size={16} />
                            {post.claps_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            {post.comments_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark size={16} />
                            {post.bookmarks_count || 0}
                          </span>
                        </div>
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

                    {/* Three Dots Menu (only for own profile) */}
                    {isOwnProfile && (
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(openDropdown === post.id ? null : post.id);
                          }}
                          className="p-2 bg-gray-200 rounded-full transition"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openDropdown === post.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <button
                              onClick={() => handleMoveToTrash(post.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                            >
                              Move to Trash
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="mt-8 sm:mt-10 px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h3 className="text-lg sm:text-xl font-bold">About</h3>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditBioOpen(true)}
                  className="px-4 py-2 bg-black text-white text-sm sm:text-base rounded-md hover:bg-gray-800 transition"
                >
                  Edit Bio
                </button>
              )}
            </div>

            {!bio ? (
              <p className="text-gray-700 text-sm sm:text-base mb-4">No bio yet.</p>
            ) : (
              <p className="text-gray-700 text-sm sm:text-base mb-4">{bio}</p>
            )}
          </div>
        )}

        {/* Manage Post Tab */}
        {activeTab === "managepost" && isOwnProfile && (
          <div className="mt-4">
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                className={`pb-2 ${manageTab === "draft" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
                onClick={() => setManageTab("draft")}
              >
                Drafts ({draftPosts.length})
              </button>
              <button
                className={`pb-2 ${manageTab === "trash" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
                onClick={() => setManageTab("trash")}
              >
                Trash ({trashPosts.length})
              </button>
            </div>

            {/* Draft Posts */}
            {manageTab === "draft" && (
              <div className="flex flex-col gap-6 sm:gap-8">
                {draftPosts.length === 0 ? (
                  <p className="text-gray-500 text-center">No draft posts.</p>
                ) : (
                  draftPosts.map((post) => (
                    <div key={post.id} className="relative">
                      <Link
                        href={`/blog-editor/${post.id}`}
                        className="group flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8 rounded-xl p-4 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
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

                      {/* Three Dots Menu */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(openDropdown === post.id ? null : post.id);
                          }}
                          className="p-2 bg-gray-200 rounded-full transition"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openDropdown === post.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <button
                              onClick={() => handleMoveToTrash(post.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                            >
                              Move to Trash
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Trash Posts */}
            {manageTab === "trash" && (
              <div className="flex flex-col gap-6 sm:gap-8">
                {trashPosts.length === 0 ? (
                  <p className="text-gray-500 text-center">Trash is empty.</p>
                ) : (
                  trashPosts.map((post) => (
                    <div key={post.id} className="relative">
                      <div className="group flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 border-b border-gray-200 pb-6 sm:pb-8 rounded-xl p-4 hover:bg-gray-50 transition-all">
                        <div className="flex-1 min-w-0">
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
                      </div>

                      {/* Three Dots Menu */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdown(openDropdown === post.id ? null : post.id);
                          }}
                          className="p-2 bg-gray-200 rounded-full transition"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openDropdown === post.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <button
                              onClick={() => handleMoveToDraft(post.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition border-b"
                            >
                              Move to Drafts
                            </button>
                            <button
                              onClick={() => confirmDelete(post.id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
                            >
                              Delete Permanently
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {isOwnProfile && (
        <EditBio
          isOpen={isEditBioOpen}
          onClose={() => setIsEditBioOpen(false)}
          currentBio={bio}
          onSave={handleBioSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to permanently delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}