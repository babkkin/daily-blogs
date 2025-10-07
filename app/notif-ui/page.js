"use client";
import { useState } from "react";

export default function NotificationsUI() {
	const [activeTab, setActiveTab] = useState("all");

	const notifications = [
		{ id: 1, type: "all", message: "Duterte liked your post", time: "2h ago" },
		{ id: 2, type: "all", message: "Marcos started following you", time: "5h ago" },
		{ id: 3, type: "responses", message: "Aquino replied to your comment", time: "1d ago" },
	];

	const filtered = notifications.filter(
		(n) => activeTab === "all" || n.type === activeTab
	);

	return (
		<div className="flex min-h-screen bg-white text-black justify-center">
			<main className="w-full max-w-2xl p-8">
				{/* Header */}
				<h1 className="text-3xl font-bold mb-6">Notifications</h1>

				{/* Tabs */}
				<div className="flex gap-8 border-b mb-6">
					<button
						className={`pb-2 ${
							activeTab === "all"
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("all")}
					>
						All
					</button>
					<button
						className={`pb-2 ${
							activeTab === "responses"
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("responses")}
					>
						Responses
					</button>
				</div>

				{/* List */}
				{filtered.length > 0 ? (
					<ul className="space-y-4">
						{filtered.map((notif) => (
							<li
								key={notif.id}
								className="flex justify-between items-center border-b pb-4"
							>
								<span className="text-gray-800">{notif.message}</span>
								<span className="text-sm text-gray-500">{notif.time}</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 mt-6">{"You're all caught up."}</p>
				)}
			</main>
		</div>
	);
}
