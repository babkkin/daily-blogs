"use client";
import React, { useState, useCallback, useMemo } from "react"; // Fixed: Added React import
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Trash2, Edit2, X, Check, Reply } from "lucide-react";
import { useSession } from "next-auth/react";

// Constants
const MAX_COMMENT_LENGTH = 500;
const MAX_RECURSION_DEPTH = 5;
const ICON_SIZE_MOBILE = 14;
const ICON_SIZE_SM = 16;
const AVATAR_FALLBACK_COLOR = "bg-purple-600";

// Separate memoized recursive component (stable for React reconciliation)
const RenderComment = React.memo(
  function RenderComment({ comment, isReply = false, parentId = null, depth = 0, 
                           session, editingCommentId, editingText, setEditingText, replyingTo, replyText, setReplyText, submitting, loadingReplies,
                           timeAgo, startEditComment, handleDeleteComment, handleEditComment, 
                           startReply, handleReplySubmit, cancelEdit, cancelReply }) {
    if (depth > MAX_RECURSION_DEPTH) {
      return <p className="text-gray-500 text-xs ml-8">Thread too deep...</p>;
    }

    return (
      <div
        className={`border border-gray-200 rounded-lg bg-white ${
          isReply ? "ml-8 sm:ml-12 mt-2" : ""
        }`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Link href={`/profile/${comment.user_id}`} className="flex-shrink-0">
              {comment.profile_url ? (
                <Image
                  src={comment.profile_url}
                  alt={comment.user_name || "User"}
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
                  unoptimized={comment.profile_url.startsWith('http')}
                />
              ) : (
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${AVATAR_FALLBACK_COLOR} flex items-center justify-center text-white font-bold text-xs sm:text-sm`}>
                  {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/profile/${comment.user_id}`}
                    className="font-semibold text-gray-900 hover:underline text-sm sm:text-base block truncate"
                  >
                    {comment.user_name || "Anonymous"}
                  </Link>
                  <p className="text-[10px] sm:text-xs text-gray-500">{timeAgo(comment.created_at)}</p>
                </div>

                {session?.user?.id === comment.user_id && editingCommentId !== comment.comment_id && (
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEditComment(comment)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                      aria-label={`Edit comment by ${comment.user_name}`}
                    >
                      <Edit2 size={ICON_SIZE_MOBILE} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id, parentId)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                      aria-label={`Delete comment by ${comment.user_name}`}
                    >
                      <Trash2 size={ICON_SIZE_MOBILE} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment.comment_id ? (
                <div>
                  <textarea
                    id={`edit-${comment.comment_id}`}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    rows={3}
                    maxLength={MAX_COMMENT_LENGTH}
                    aria-describedby={`counter-edit-${comment.comment_id}`}
                  />
                  <div id={`counter-edit-${comment.comment_id}`} className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditComment(comment.comment_id, parentId)}
                      className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-xs sm:text-sm"
                      disabled={submitting}
                    >
                      <Check size={ICON_SIZE_MOBILE} className="sm:w-4 sm:h-4" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 sm:px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <X size={ICON_SIZE_MOBILE} className="sm:w-4 sm:h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 break-words text-sm sm:text-base mb-2">{comment.text}</p>
                  {!isReply && session && (
                    <button
                      onClick={() => startReply(comment.comment_id)}
                      className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm flex items-center gap-1"
                      aria-label="Reply to comment"
                    >
                      <Reply size={ICON_SIZE_MOBILE} className="sm:w-4 sm:h-4" />
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {replyingTo === comment.comment_id && (
            <div className="mt-3 ml-8 sm:ml-12">
              <textarea
                id={`reply-${comment.comment_id}`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                placeholder="Write a reply..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                maxLength={MAX_COMMENT_LENGTH}
                aria-describedby={`counter-reply-${comment.comment_id}`}
                disabled={submitting}
              />
              <div id={`counter-reply-${comment.comment_id}`} className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <p className="text-xs sm:text-sm text-gray-500">{replyText.length}/{MAX_COMMENT_LENGTH}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(comment.comment_id)}
                    className="px-2 sm:px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-xs sm:text-sm disabled:opacity-50"
                    disabled={!replyText.trim() || submitting}
                  >
                    Reply
                  </button>
                  <button
                    onClick={cancelReply}
                    className="px-2 sm:px-3 py-1 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fixed: Added loading spinner */}
          {loadingReplies?.get(comment.comment_id) && (
            <div className="mt-2 ml-8 sm:ml-12 flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Posting reply...</span>
            </div>
          )}
        </div>

        {/* Fixed: Added dedup band-aid if API still leaks dups */}
        {comment.replies?.length > 0 && (
          <div className="space-y-2 pb-2">
            {Array.from(new Map(comment.replies.map(r => [r.comment_id, r])).values()).map((reply) => (
              <div key={reply.comment_id}>
                <RenderComment 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.comment_id} 
                  depth={depth + 1}
                  {...renderCommentProps}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
  // Enhanced comparator (added loadingReplies, setters for stability)
  (prevProps, nextProps) => {
    return prevProps.comment.comment_id === nextProps.comment.comment_id &&
           JSON.stringify(prevProps.comment.replies) === JSON.stringify(nextProps.comment.replies) &&
           prevProps.depth === nextProps.depth &&
           prevProps.session?.user?.id === nextProps.session?.user?.id &&
           prevProps.editingCommentId === nextProps.editingCommentId &&
           prevProps.replyingTo === nextProps.replyingTo &&
           prevProps.submitting === nextProps.submitting &&
           prevProps.loadingReplies?.get(prevProps.comment.comment_id) === nextProps.loadingReplies?.get(nextProps.comment.comment_id);
  }
);

export default function BetterComments({ blogId, initialComments = [] }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(new Map()); // Fixed: Moved inside component

  const addNotification = useCallback((message, type = "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000);
  }, []);

  const refetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/comments?blogId=${blogId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
      } else {
        addNotification(data.error || "Failed to load comments");
      }
    } catch (err) {
      console.error("Error refetching comments:", err);
      addNotification("Failed to load comments");
    }
  }, [blogId, addNotification]);

  const timeAgo = useCallback((date) => {
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
  }, []);

  // Fixed: Non-optimistic for top-level too (just refetch, no append)
  const handleCommentSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/blogs/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, text: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        await refetchComments(); // Full sync
      } else {
        addNotification(data.error || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      addNotification("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }, [newComment, blogId, submitting, refetchComments, addNotification]);

  const handleReplySubmit = useCallback(async (parentId) => {
    if (!replyText.trim() || submitting) return;

    setLoadingReplies((prev) => new Map(prev).set(parentId, true));
    setSubmitting(true);
    try {
      const res = await fetch("/api/blogs/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, text: replyText, parent_id: parentId }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        setReplyingTo(null);
        await refetchComments(); // Full sync
      } else {
        addNotification(data.error || "Failed to post reply");
      }
    } catch (err) {
      console.error(err);
      addNotification("Failed to post reply");
    } finally {
      setSubmitting(false);
      setLoadingReplies((prev) => {
        const newMap = new Map(prev);
        newMap.delete(parentId);
        return newMap;
      });
    }
  }, [replyText, blogId, submitting, refetchComments, addNotification, parentId]); // Fixed: Added parentId dep

  const handleDeleteComment = useCallback(async (commentId, parentId = null) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/comments?commentId=${commentId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await refetchComments(); // Full sync (simpler than optimistic)
      } else {
        addNotification(data.error || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete comment");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, refetchComments, addNotification]);

  const startEditComment = useCallback((comment) => {
    setEditingCommentId(comment.comment_id);
    setEditingText(comment.text);
    setTimeout(() => document.querySelector(`#edit-${comment.comment_id}`)?.focus(), 0);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditingText("");
  }, []);

  const handleEditComment = useCallback(async (commentId, parentId = null) => {
    if (!editingText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/blogs/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, text: editingText }),
      });
      const data = await res.json();
      if (data.success) {
        cancelEdit();
        await refetchComments(); // Full sync
      } else {
        addNotification(data.error || "Failed to update comment");
      }
    } catch (err) {
      console.error(err);
      addNotification("Failed to update comment");
    } finally {
      setSubmitting(false);
    }
  }, [editingText, submitting, refetchComments, addNotification, cancelEdit]);

  const startReply = useCallback((commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
    setTimeout(() => document.querySelector(`#reply-${commentId}`)?.focus(), 0);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyText("");
  }, []);

  // Fixed: Added loadingReplies to deps
  const renderCommentProps = useMemo(() => ({
    session,
    editingCommentId,
    editingText,
    setEditingText,
    replyingTo,
    replyText,
    setReplyText,
    submitting,
    loadingReplies, // Added
    timeAgo,
    startEditComment,
    handleDeleteComment,
    handleEditComment,
    startReply,
    handleReplySubmit,
    cancelEdit,
    cancelReply,
  }), [
    session, editingCommentId, editingText, setEditingText, replyingTo, replyText, setReplyText, submitting, loadingReplies,
    timeAgo, startEditComment, handleDeleteComment, handleEditComment,
    startReply, handleReplySubmit, cancelEdit, cancelReply
  ]);

  const renderNotifications = useMemo(() =>
    notifications.map(({ id, message, type }) => (
      <div
        key={id}
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {message}
      </div>
    )),
    [notifications]
  );

  if (initialComments.length === 0 && !comments.length) {
    return (
      <div className="mt-6 sm:mt-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {renderNotifications}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
        </h2>

        <form onSubmit={handleCommentSubmit} className="mb-4 sm:mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder={session ? "Write a comment..." : "Please login to comment"}
            className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
            maxLength={MAX_COMMENT_LENGTH}
            disabled={!session || submitting}
            aria-describedby="counter-new"
          />
          <div id="counter-new" className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <p className="text-xs sm:text-sm text-gray-500">{newComment.length}/{MAX_COMMENT_LENGTH} characters</p>
            <button
              type="submit"
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              disabled={!newComment.trim() || !session || submitting}
            >
              <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> Post Comment
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic text-sm sm:text-base">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {comments.map((comment) => (
              <div key={comment.comment_id}>
                <RenderComment 
                  comment={comment} 
                  depth={0}
                  {...renderCommentProps}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}