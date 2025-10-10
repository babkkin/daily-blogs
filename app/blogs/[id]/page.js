"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) return;

		const fetchBlog = async () => {
			try {
				const res = await fetch(`/api/blogs/single-blog?id=${encodeURIComponent(id)}`, { cache: "no-store" });
				const data = await res.json();

				if (data.success) setBlog(data.blog);
				else setError(data.error || "Blog not found");
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBlog();
	}, [id]);

	if (loading) return <div>Loading blog...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!blog) return <div>No blog found.</div>;

	return (
		<div className="max-w-4xl mx-auto px-6 py-12">
			<Link href="/blogs" className="text-emerald-600 hover:underline mb-4 block">← Back to Blogs</Link>
			<h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
			<p className="text-gray-500 text-sm mb-6">{new Date(blog.created_at).toLocaleDateString()}</p>
			{blog.image_url && (
				<div className="relative w-full aspect-[16/9] mb-6 rounded-lg overflow-hidden">
					<Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
				</div>
			)}
			<div className="text-gray-800 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
		</div>
	);
}
