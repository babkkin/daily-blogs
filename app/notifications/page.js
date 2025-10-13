"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsUI() {
	const [activeTab, setActiveTab] = useState("all");
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (data.success) {
					setNotifications(data.notifications);
				}
			} catch (err) {
				console.error("Failed to fetch notifications:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, []);

	const markAsRead = async (notificationId) => {
		try {
			await fetch("/api/notifications/mark-read", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ notificationId }),
			});

			setNotifications(prev =>
				prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
			);
		} catch (err) {
			console.error("Failed to mark as read:", err);
		}
	};

	const filtered = notifications.filter(
		(n) => activeTab === "all" || n.type === activeTab
	);

	const timeAgo = (date) => {
		const seconds = Math.floor((new Date() - new Date(date)) / 1000);
		let interval = seconds / 86400;
		if (interval > 1) return Math.floor(interval) + "d ago";
		interval = seconds / 3600;
		if (interval > 1) return Math.floor(interval) + "h ago";
		interval = seconds / 60;
		if (interval > 1) return Math.floor(interval) + "m ago";
		return "Just now";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p>Loading notifications...</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-white text-black justify-center">
			<main className="w-full max-w-2xl p-8">
				<h1 className="text-3xl font-bold mb-6">Notifications</h1>

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
							activeTab === "like"
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("like")}
					>
						Likes
					</button>
					<button
						className={`pb-2 ${
							activeTab === "comment"
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("comment")}
					>
						Comments
					</button>
					<button
						className={`pb-2 ${
							activeTab === "follow"
								? "border-b-2 border-black"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("follow")}
					>
						Follows
					</button>
				</div>

				{filtered.length > 0 ? (
					<ul className="space-y-4">
						{filtered.map((notif) => (
							<li
								key={notif.id}
								className={`flex gap-3 items-start border-b pb-4 ${
									!notif.is_read ? "bg-blue-50" : ""
								} p-3 rounded hover:bg-gray-50 transition cursor-pointer`}
								onClick={() => {
									if (!notif.is_read) markAsRead(notif.id);
									if (notif.link) window.location.href = notif.link;
								}}
							>
								<Link href={`/profile/${notif.actor_id}`}>
									{notif.actor_profile_url ? (
										<Image
											src={notif.actor_profile_url}
											alt={notif.actor_name}
											width={40}
											height={40}
											className="w-10 h-10 rounded-full object-cover"
											unoptimized
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
											{notif.actor_name?.charAt(0).toUpperCase() || "U"}
										</div>
									)}
								</Link>

								<div className="flex-1">
									<p className="text-gray-800">
										<Link href={`/profile/${notif.actor_id}`} className="font-semibold hover:underline">
											{notif.actor_name}
										</Link>{" "}
										{notif.message}
									</p>
									<span className="text-sm text-gray-500">{timeAgo(notif.created_at)}</span>
								</div>

								{!notif.is_read && (
									<span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500 mt-6">{"You're all caught up!"}</p>
				)}
			</main>
		</div>
	);
}