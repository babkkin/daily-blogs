"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MediumStyleProfile({ userId }) {
	const [activeTab, setActiveTab] = useState("home");
	const [name, setName] = useState("Digong");
	const [bio, setBio] = useState("");
	const [photo, setPhoto] = useState(null);

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setPhoto(reader.result);
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				// Fetch only the user's blogs
				const res = await fetch(`/api/blogs?user_id=${userId}`);
				const data = await res.json();
				if (data.success) {
					// Map blog_id to id for proper routing
					const mappedPosts = data.blogs.map((b) => ({
						...b,
						id: b.blog_id || b.id
					}));
					setPosts(mappedPosts);
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
	}, [userId]);

	return (
		<div className="flex min-h-screen bg-white text-black justify-center">
			<main className="w-full max-w-5xl p-8">
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

				{/* Home Tab: User's Posts */}
				{activeTab === "home" && (
					<div className="flex flex-col gap-8">
						{loading ? (
							<p className="text-gray-500 text-center">Loading posts...</p>
						) : posts.length === 0 ? (
							<p className="text-gray-500 text-center">No posts yet.</p>
						) : (
							posts.map((post) => (
								<Link
									key={post.id}
									href={`/blogs/${post.id}`}
									className="group flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-8 rounded-xl p-4 hover:bg-gray-50 transition-all cursor-pointer"
								>
									{/* Left Side: Text */}
									<div className="flex-1">
										<p className="text-sm text-gray-500 mb-1">
											Published on {new Date(post.created_at).toLocaleDateString()}
										</p>
										<h2 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">
											{post.title}
										</h2>
										<p className="text-gray-600 text-base mt-1 line-clamp-2">
											{post.subtitle || "No subtitle provided."}
										</p>
									</div>

									{/* Right Side: Thumbnail */}
									{post.image_url && (
										<div className="w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded-md">
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

				{/* About Tab */}
				{activeTab === "about" && (
					<div className="mt-10">
						{!bio ? (
							<p className="text-gray-700 mb-4">No bio yet. Click edit to add one.</p>
						) : (
							<p className="text-gray-700 mb-4">{bio}</p>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
