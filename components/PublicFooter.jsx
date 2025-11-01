"use client";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function PublicFooter() {
	return (
		<footer className="bg-white border-t border-gray-200 px-4 sm:px-6 md:px-10 py-6 flex flex-col sm:flex-row items-start justify-between gap-6">
			{/* Left: Full Logo with right margin */}
			<div className="text-2xl font-serif tracking-tight text-gray-900 mr-6">
				DailyBlogs
			</div>

			{/* Middle: Social Media Icons + Names stacked vertically */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
					<FaFacebookF className="text-xl" />
					<span>DailyBlogs</span>
				</div>
				<div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
					<FaTwitter className="text-xl" />
					<span>DailyBlogs</span>
				</div>
				<div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
					<FaInstagram className="text-xl" />
					<span>DailyBlogs</span>
				</div>
			</div>

			{/* Right: Contact Button + Copyright stacked vertically */}
			<div className="flex flex-col items-start gap-2 ml-6">
				<button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200">
					Contact Us
				</button>
				<span className="text-gray-500 text-sm sm:text-base">
					© {new Date().getFullYear()} DailyBlogs. All rights reserved.
				</span>
			</div>
		</footer>
	);
}
