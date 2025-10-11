"use client";

import { useState } from "react";

export default function EditBio({ isOpen, onClose, currentBio, onSave }) {
  const [bio, setBio] = useState(currentBio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/blogs/user/update-bio", {  // Changed to match your file location
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();

      if (data.success) {
        onSave(bio);
        onClose();
      } else {
        alert("Failed to update bio: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating bio:", err);
      alert("Failed to update bio");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Bio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
          maxLength={100}
        />

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">
            {bio.length}/100 characters
          </span>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}