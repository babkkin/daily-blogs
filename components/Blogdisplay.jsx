"use client";
import Link from "next/link";
import Image from "next/image";

export default function Blogdisplay({ blogs }) {
	return (
		<div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">
			{blogs.map((blog) => (
				<article key={blog.id} className="border-b border-gray-200 pb-12">
					{/* Title + Subtitle */}
					<Link href={`/blog/${blog.id}`} className="group">
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
							{blog.title}
						</h2>
						<p className="text-gray-600 mb-3">
							{blog.subtitle || blog.content?.slice(0, 100) + "..."}
						</p>
					</Link>

					{/* Author + Date */}
					<div className="flex items-center text-sm text-gray-500 mb-4">
						<p>{blog.author || "Anonymous"}</p>
						<span className="mx-2">•</span>
						<p>{new Date(blog.created_at).toLocaleDateString()}</p>
					</div>

					{/* Thumbnail (clickable) */}
					<Link
						href={`/blog/${blog.id}`}
						className="block rounded-2xl overflow-hidden"
					>
						<div className="relative w-full aspect-[16/9]">
							<Image
								src={blog.image_url || "/placeholder.png"}
								alt={blog.title}
								fill
								className="object-cover hover:scale-105 transition-transform duration-300"
								sizes="(max-width: 768px) 100vw, 700px"
							/>
						</div>
					</Link>
				</article>
			))}
		</div>
	);
}
