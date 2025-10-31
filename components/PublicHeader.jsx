"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PublicHeader() {
	const { status } = useSession();
	const pathname = usePathname();

	if (status === "authenticated" && pathname !== "/about") return null;

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-5 md:px-10 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
			{/* Logo (left / top on mobile) */}
			<Link
				href="/"
				className="text-2xl md:text-3xl lg:text-4xl font-semibold transition-colors text-gray-900 hover:text-gray-700 text-center md:text-left w-full md:w-auto"
			>
				DailyBlogs
			</Link>

			{/* Navigation Links (right / bottom on mobile) */}
			<nav className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
				<Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
					Home
				</Link>
				<Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
					About
				</Link>
				<Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
					Login
				</Link>
			</nav>
		</header>
	);
}
