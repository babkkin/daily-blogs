"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";


export default function Header() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();
	const dropdownRef = useRef(null);

	// Fetch search results live
	useEffect(() => {
		if (searchQuery.trim() === "") {
			setSearchResults([]);
			return;
		}

		const fetchResults = async () => {
			try {
				const res = await fetch(`/api/blogs/search?q=${encodeURIComponent(searchQuery)}`);
				const data = await res.json();
				if (data.success) setSearchResults(data.blogs);
			} catch (err) {
				console.error("Search error:", err);
			}
		};

		fetchResults();
	}, [searchQuery]);

	// Close dropdown if clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim() !== "") {
			router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			setSearchResults([]);
			setShowDropdown(false);
		}
	};

	const handleResultClick = (id) => {
		router.push(`/blogs/${id}`);
		setSearchQuery("");
		setSearchResults([]);
		setShowDropdown(false);
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 md:px-8 py-3 flex items-center justify-between">
			<link
				rel="stylesheet"
				href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
			/>
			<link
				rel="stylesheet"
				href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
			/>

			<div className="flex items-center gap-3 relative">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="text-2xl p-1 rounded-md hover:bg-gray-100 transition"
				>
					<i className="fi fi-br-menu-burger"></i>
				</button>

				<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<Link href="/home" className="text-2xl font-bold">
					DailyBlogs
				</Link>

				<form
					onSubmit={handleSearchSubmit}
					className="ml-3 flex items-center bg-gray-100 rounded-full px-3 py-1 w-[250px] focus-within:ring-2 focus-within:ring-black transition relative"
				>
					<i className="fi fi-rr-search text-gray-500 text-lg"></i>
					<input
						type="text"
						placeholder="Search blogs or authors"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setShowDropdown(true);
						}}
						className="bg-transparent outline-none px-2 w-full"
					/>

					{showDropdown && searchResults.length > 0 && (
						<ul
							ref={dropdownRef}
							className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
						>
							{searchResults.map((blog) => (
								<li
									key={blog.id}
									className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
									onClick={() => handleResultClick(blog.id)}
								>
									{blog.image_url && (
										<img
											src={blog.image_url}
											alt={blog.title}
											className="w-10 h-10 object-cover rounded"
										/>
									)}
									<div className="flex flex-col">
										<span className="font-medium">{blog.title}</span>
										<span className="text-xs text-gray-500">{blog.author_name}</span>
									</div>
								</li>
							))}
						</ul>
					)}
				</form>
			</div>

			<div className="flex items-center gap-5 relative">
				<button
					onClick={() => router.push("/blog-editor")}
					className="flex items-center gap-1 text-lg"
				>
					<i className="fi fi-rr-edit"></i>
					<span>Write</span>
				</button>

				<div className="relative">
					<button
						className="text-xl p-1 hover:bg-gray-100 rounded-full transition"
						onClick={() => alert("Notifications placeholder")}
					>
						<i className="fi fi-rr-bell"></i>
					</button>
					<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
				</div>

				<button
					className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
					onClick={() => router.push("/user-profile")}
				>
					<i className="fi fi-rr-user"></i>
				</button>
			</div>
		</header>
	);
}
