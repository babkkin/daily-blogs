"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await fetch("/api/blogs", { cache: "no-store" });
				if (!res.ok) throw new Error("Network response was not ok");
				const data = await res.json();

				if (data.success) {
					setBlogs(data.blogs);
				} else {
					setError("Server returned an error.");
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen text-gray-600 text-xl">
				Loading blogs...
			</div>
		);

	if (error)
		return (
			<div className="flex items-center justify-center h-screen text-red-500 text-xl">
				Error: {error}
			</div>
		);

	return (
		<div className="max-w-5xl mx-auto px-6 py-16">
			<h1 className="text-4xl font-bold mb-12 text-gray-900 text-center">
				Latest Blogs
			</h1>

			<div className="flex flex-col gap-12">
				{blogs.map((blog) => (
					<Link
						key={blog.id}
						href={`/blogs/${blog.id}`}
						className="group flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-8 hover:bg-gray-50 transition-all rounded-xl p-4"
					>
						{/* Left Side: Text */}
						<div className="flex-1">
							<p className="text-sm text-gray-500 mb-1">
								In <span className="font-medium text-gray-700">Data Science Collective</span> by{" "}
								<span className="text-gray-700 font-semibold">Unknown Author</span>
							</p>

							<h2 className="text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">
								{blog.title}
							</h2>

							<p className="text-gray-600 text-base mt-1 line-clamp-2">
								{blog.subtitle || "No description provided."}
							</p>

							<p className="text-gray-400 text-sm mt-2">
								{new Date(blog.created_at).toLocaleDateString()}
							</p>
						</div>

						{/* Right Side: Thumbnail */}
						{blog.image_url && (
							<div className="w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded-md">
								<Image
									src={blog.image_url}
									alt={blog.title}
									width={400}
									height={250}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
