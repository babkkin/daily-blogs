"use client";

import React, { useState, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import "../globals.css";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor() {
	const [title, setTitle] = useState("");
	const [subtitle, setSubtitle] = useState(""); // ✅ new subtitle state
	const [content, setContent] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleThumbnailChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setThumbnail(file);
			setThumbnailUrl(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async () => {
		if (!title.trim() || !subtitle.trim() || !content.trim() || !thumbnail || isUploading) return;

		setIsUploading(true);

		const formData = new FormData();
		formData.append("file", thumbnail);
		formData.append("title", title);
		formData.append("subtitle", subtitle); // ✅ send subtitle
		formData.append("content", content);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (data.success) {
				// reset everything silently
				setTitle("");
				setSubtitle("");
				setContent("");
				setThumbnail(null);
				setThumbnailUrl("");
				if (fileInputRef.current) fileInputRef.current.value = "";
			}
		} catch (err) {
			console.error("Upload error:", err);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Write a Blog</h1>

			{/* Thumbnail Upload Section */}
			<div className="mb-4 relative">
				<label
					htmlFor="thumbnail-upload"
					className="w-full h-60 flex flex-col items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-black/10 transition"
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
						<span className="text-gray-500 text-lg">Upload Thumbnail</span>
					)}
				</label>

				{thumbnailUrl && (
					<button
						className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center rounded-tr-xl bg-black text-white text-3xl font-bold hover:bg-gray-800"
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

			{/* Title Input */}
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Enter blog title..."
				className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black"
			/>

			{/* ✅ Subtitle Input */}
			<input
				type="text"
				value={subtitle}
				onChange={(e) => setSubtitle(e.target.value)}
				placeholder="Enter a short subtitle..."
				className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-base italic focus:outline-none focus:ring-2 focus:ring-black"
			/>

			{/* Blog Content Editor */}
			<div className="bg-white rounded-lg shadow-md mb-4">
				<ReactQuill theme="snow" value={content} onChange={setContent} className="custom-editor" />
			</div>

			{/* Publish Button */}
			<button
				onClick={handleSubmit}
				disabled={isUploading || !title.trim() || !subtitle.trim() || !content.trim() || !thumbnail}
				className={`px-6 py-3 rounded-lg transition-colors ${
					isUploading
						? "bg-gray-500 text-white cursor-not-allowed"
						: "bg-black text-white hover:bg-gray-800"
				}`}
			>
				{isUploading ? "Publishing..." : "Publish"}
			</button>
		</div>
	);
}
