"use client";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ Import Link

export default function Sidebar({ isOpen, onClose }) {
	return (
		<motion.div
			initial={{ x: "-100%" }}
			animate={{ x: isOpen ? 0 : "-100%" }}
			transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
			className="fixed top-0 left-0 h-full max-h-full overflow-y-auto w-[25vh] bg-white text-gray-800 shadow-lg z-50 flex flex-col justify-between"
			style={{ boxShadow: "2px 0 5px rgba(0,0,0,0.05)" }}
		>
			{/* Header Section */}
			<div>
				<div className="p-4 flex justify-between items-center border-b border-gray-200">
					<h2 className="text-lg font-semibold">Menu</h2>
					<button
						onClick={onClose}
						className="text-2xl text-gray-500 hover:text-gray-700 transition"
					>
						&times;
					</button>
				</div>

				{/* Menu Items */}
				<ul className="p-4 space-y-2 mt-[3vh]">
					{/* Home */}
					<li className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out">
						<i className="fi fi-rr-home text-xl flex-shrink-0"></i>
						<span className="text-xl leading-none">Home</span>
					</li>

					{/* About */}
					<Link href="/about" className="block">
						<li
							onClick={onClose}
							className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out"
						>
							<i className="fi fi-rr-info text-xl flex-shrink-0"></i>
							<span className="text-xl leading-none">About</span>
						</li>
					</Link>

					{/* ✅ Settings (Linked to /settings) */}
					<Link href="/setting" className="block">
						<li
							onClick={onClose}
							className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out"
						>
							<i className="fi fi-rr-settings text-xl flex-shrink-0"></i>
							<span className="text-xl leading-none">Settings</span>
						</li>
					</Link>
				</ul>


			</div>


			{/* Logout Section */}
			<div className="p-4">
				<li className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out list-none">
					<i className="fi fi-rr-sign-out-alt text-lg flex-shrink-0"></i>
					<span className="text-base leading-none">Logout</span>
				</li>
			</div>

		</motion.div>
	);
}
