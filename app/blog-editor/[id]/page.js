"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import "react-quill-new/dist/quill.snow.css";
import "../../globals.css"; // go up two levels

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
  const { id } = useParams(); // blog ID
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch existing blog if id exists
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.success) {
          setTitle(data.blog.title);
          setSubtitle(data.blog.subtitle);
          setContent(data.blog.content);
          setThumbnailUrl(data.blog.image_url || "");
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (status = "published") => {
  if (!title.trim() || !content.trim()) return;
  if (status === "published" && (!subtitle.trim() || (!thumbnail && !thumbnailUrl)))
    return;

  if (status === "draft") setIsSavingDraft(true);
  else setIsPublishing(true);

  const formData = new FormData();
if (thumbnail) {
  formData.append("file", thumbnail); // new file
} else if (thumbnailUrl) {
  formData.append("existingImageUrl", thumbnailUrl); // send existing URL
}
  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("content", content);
  formData.append("status", status);

  try {
    const endpoint = id ? `/api/blogs/${id}` : "/api/upload";
    const method = id ? "PUT" : "POST";

    const res = await fetch(endpoint, { method, body: formData });
    const data = await res.json();

    if (data.success) {
      alert(status === "draft" ? "Draft saved!" : "Post published!");
      
  if (status === "draft") {
    // Redirect to the "Manage Post" tab instead of the blog page
     router.push(`/profile/${data.blog?.user_id }?tab=managepost`);
  } else {
    router.push(id ? `/blogs/${id}` : "/");
  }
    } else {
      alert(data.error || "Failed to save post");
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save post");
  } finally {
    if (status === "draft") setIsSavingDraft(false);
    else setIsPublishing(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        {id ? "Edit Blog" : "Write a Blog"}
      </h1>

      {/* Thumbnail Upload */}
      <div className="mb-4 relative">
        <label
          htmlFor="thumbnail-upload"
          className="w-full h-40 sm:h-60 flex flex-col items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-black/10 transition"
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="Thumbnail"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-500 text-base sm:text-lg">
              Upload Thumbnail
            </span>
          )}
        </label>

        {thumbnailUrl && (
          <button
            className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-tr-xl bg-black text-white text-2xl sm:text-3xl font-bold hover:bg-gray-800"
            onClick={() => {
              setThumbnail(null);
              setThumbnailUrl("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            type="button"
          >
            ×
          </button>
        )}

        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter blog title..."
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Subtitle */}
      <input
        type="text"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Enter a short subtitle..."
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-sm sm:text-base italic focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="custom-editor text-sm sm:text-base"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleSubmit("draft")}
          disabled={isSavingDraft || !title.trim() || !content.trim()}
          className="px-6 py-3 rounded-lg text-base sm:text-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition"
        >
          {isSavingDraft ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={() => handleSubmit("published")}
          disabled={
            isPublishing || !title.trim() || !subtitle.trim() || !content.trim() || (!thumbnail && !thumbnailUrl)
          }
          className={`px-6 py-3 rounded-lg text-base sm:text-lg font-medium ${
            isPublishing
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          } transition`}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
