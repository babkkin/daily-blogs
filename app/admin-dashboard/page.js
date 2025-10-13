"use client";

import PostsManagement from "@/components/admin/PostsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	LineChart,
	Line,
} from "recharts";

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("overview");
	const [currentDate, setCurrentDate] = useState("");
	const [postsData, setPostsData] = useState([]);
	const [usersData, setUsersData] = useState([]);
	const [stats, setStats] = useState({
		totalPosts: 0,
		activeUsers: 0,
		totalComments: 0,
		pendingReviews: 0
	});
	const [loading, setLoading] = useState(true);

	// Update live date
	useEffect(() => {
		const updateDate = () => {
			const now = new Date();
			const formatted = now.toLocaleString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
			setCurrentDate(formatted);
		};
		updateDate();
		const interval = setInterval(updateDate, 1000);
		return () => clearInterval(interval);
	}, []);

	// Fetch real analytics data
	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const res = await fetch("/api/admin/analytics");
				const data = await res.json();

				if (data.success) {
					setStats({
						totalPosts: data.stats.totalPosts,
						activeUsers: data.stats.activeUsers,
						totalComments: data.stats.totalComments,
						pendingReviews: data.stats.pendingReviews
					});
					setPostsData(data.postsPerDay);
					setUsersData(data.usersGrowth);
				}
			} catch (err) {
				console.error("Failed to fetch analytics:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-t-black border-gray-300 rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600">Loading analytics...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-white text-black justify-center">
			<main className="w-full max-w-3xl p-8">
				{/* Header */}
				<div className="flex flex-col items-center mb-10">
					<div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white text-4xl font-bold">
						A
					</div>
					<h2 className="text-3xl font-bold mt-4">Admin Dashboard</h2>
					<p className="text-gray-500 text-sm mt-1">{currentDate}</p>
				</div>

				{/* Tabs */}
				<div className="border-b flex justify-center gap-10 text-lg font-medium mb-8 cursor-pointer">
					{["overview", "posts", "users", "settings"].map((tab) => (
						<button
							key={tab}
							className={`pb-2 ${
								activeTab === tab
									? "border-b-2 border-black"
									: "text-gray-500"
							}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				{/* Overview Tab */}
				{activeTab === "overview" && (
					<div className="mt-10">
						<h3 className="text-2xl font-semibold mb-6">Site Overview</h3>

						{/* Summary Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
							<div className="border rounded-xl p-6 hover:shadow-lg transition">
								<h4 className="text-lg font-semibold mb-2">Total Posts</h4>
								<p className="text-gray-800 text-2xl font-bold">{stats.totalPosts}</p>
							</div>
							<div className="border rounded-xl p-6 hover:shadow-lg transition">
								<h4 className="text-lg font-semibold mb-2">Active Users</h4>
								<p className="text-gray-800 text-2xl font-bold">{stats.activeUsers}</p>
							</div>
							<div className="border rounded-xl p-6 hover:shadow-lg transition">
								<h4 className="text-lg font-semibold mb-2">Comments</h4>
								<p className="text-gray-800 text-2xl font-bold">{stats.totalComments}</p>
							</div>
							<div className="border rounded-xl p-6 hover:shadow-lg transition">
								<h4 className="text-lg font-semibold mb-2">Draft Posts</h4>
								<p className="text-gray-800 text-2xl font-bold">{stats.pendingReviews}</p>
							</div>
						</div>

						{/* Charts */}
						<div className="space-y-12">
							{/* Posts Activity */}
							<div>
								<div className="flex justify-between items-center mb-3">
									<h4 className="text-xl font-semibold">Posts per Day (Last 7 Days)</h4>
								</div>
								<div className="w-full h-64 border rounded-lg p-4">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={postsData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Bar dataKey="posts" fill="#000000" radius={6} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* User Growth */}
							<div>
								<div className="flex justify-between items-center mb-3">
									<h4 className="text-xl font-semibold">User Growth (Last 6 Months)</h4>
								</div>
								<div className="w-full h-64 border rounded-lg p-4">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={usersData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="month" />
											<YAxis />
											<Tooltip />
											<Line
												type="monotone"
												dataKey="users"
												stroke="#000000"
												strokeWidth={3}
												dot={{ r: 5 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				)}
					{/* Other Tabs */}
					{activeTab === "posts" && (
					<>
						<PostsManagement />
					</>
					)}

					{activeTab === "users" && (
					<>
						<UsersManagement />
					</>
					)}


				{activeTab === "settings" && (
					<div className="mt-10">
						<h3 className="text-2xl font-semibold mb-4">Settings</h3>
						<p className="text-gray-700">Adjust dashboard configurations.</p>
					</div>
				)}
			</main>
		</div>
	);
}