"use client";

import React, { useState,useRef } from "react";// using react-quill-new for React 19+
import "react-quill-new/dist/quill.snow.css";
import "../globals.css";
import Image from 'next/image';

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});

export default function BlogEditor() {
	const [content, setContent] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const fileInputRef = useRef(null);
	
	const handleThumbnailChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setThumbnail(file);
			setThumbnailUrl(URL.createObjectURL(file)); // preview before upload
		}
	};

	const handleSubmit = async () => {
		if (!thumbnail) {
			alert("Please select a thumbnail!");
			return;
		}

		const formData = new FormData();
		formData.append("file", thumbnail);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();

		if (data.success) {
			setThumbnailUrl(data.url);

			console.log("Blog content:", content);
			console.log("Thumbnail URL:", data.url);

			alert("Blog post prepared with thumbnail!");
		} else {
			alert("Upload failed: " + data.error);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Write a Blog</h1>

			{/* Thumbnail Upload Box */}
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
					{/* Remove Image button */}
					{thumbnailUrl && (
					<button
						className="absolute top-0 right-1 w-10 h-10 flex items-center justify-center rounded-tr-xl bg-black text-white text-5xl font-bold hover:bg-gray-800  "
						onClick={() => {
						setThumbnail(null);
						setThumbnailUrl("");
						if (fileInputRef.current) {
							fileInputRef.current.value = ""; // reset input so same file can be re-uploaded
						}
						}}
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

			{/* Blog Editor */}
			<div className="bg-white rounded-lg shadow-md mb-4">
				<ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="custom-editor"
            />

			</div>

			{/* Publish Button */}


			
			<button
				onClick={handleSubmit}
				className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
			>
				Publish
			</button>
		</div>
	);
}
