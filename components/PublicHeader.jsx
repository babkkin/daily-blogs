"use client";
import Link from "next/link";
import { useAuthModal } from "@/components/AuthModalProvider";
import { useSession } from "next-auth/react";

export default function PublicHeader() {
  const { openModal } = useAuthModal();
  const { data: session, status } = useSession();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
			{/* Logo */}
			<Link
				href="/"
				className="text-3xl md:text-4xl font-semibold transition-colors text-gray-900 hover:text-gray-700 text-center sm:text-left"
			>
				<h1 className="font-serif tracking-tight">DailyBlogs</h1>
			</Link>

			{/* Navigation / Buttons */}
			<div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-4 md:gap-6">
				<Link
					href="/about"
					className="text-gray-700 hover:text-gray-900 text-base sm:text-lg font-medium transition-colors"
				>
					About us
				</Link>

				{status !== "authenticated" && (
					<>
						<button
							className="text-gray-700 hover:text-gray-900 text-base sm:text-lg font-medium transition-colors"
							onClick={() => openModal("login")}
						>
							Sign in
						</button>
						<button
							className="px-4 sm:px-5 md:px-6 py-2 text-base sm:text-lg bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200"
							onClick={() => openModal("signup")}
						>
							Get Started
						</button>
					</>
				)}
			</div>
		</header>
	);
}
