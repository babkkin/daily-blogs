"use client";
import { useState } from "react";
<<<<<<< Updated upstream
=======
import Image from "next/image"; 
>>>>>>> Stashed changes

export default function MediumStyleProfile() {
	const [activeTab, setActiveTab] = useState("home");
	const [name, setName] = useState("Digong");
	const [bio, setBio] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [photo, setPhoto] = useState(null); // store uploaded photo

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhoto(reader.result); // Base64 preview
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		// send data to API later
		await fetch("/api/profile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, bio, pronouns }),
		});
		setIsEditing(false);
	};

	return (
		<div className="flex min-h-screen bg-white text-black justify-center">
			<main className="w-full max-w-3xl p-8">
				{/* User Info */}
				<div className="flex flex-col items-center mb-10">
					{photo ? (
<<<<<<< Updated upstream
						<img
							src={photo}
							alt="Profile"
							className="w-24 h-24 rounded-full object-cover border"
=======
						<Image
							src={photo}
							alt="Profile"
							width={96}
							height={96}
							className="rounded-full object-cover border"
							unoptimized // ✅ Needed for Base64 preview
>>>>>>> Stashed changes
						/>
					) : (
						<div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold">
							{name.charAt(0)}
						</div>
					)}
					<h2 className="text-3xl font-bold mt-4">{name}</h2>
				</div>

				{/* Tabs */}
				<div className="border-b flex justify-center gap-10 text-lg font-medium mb-8 cursor-pointer">
					<button
						className={`pb-2 ${
							activeTab === "home"
								? "border-b-2 border-black cursor-pointer"
								: "text-gray-500 cursor-pointer"
						}`}
						onClick={() => setActiveTab("home")}
					>
						Home
					</button>
					<button
						className={`pb-2 ${
							activeTab === "about"
								? "border-b-2 border-black cursor-pointer"
								: "text-gray-500 cursor-pointer"
						}`}
						onClick={() => setActiveTab("about")}
					>
						About
					</button>
				</div>

				{/* About Section */}
				{activeTab === "about" && (
					<div className="mt-10">
						{!isEditing ? (
							<div>
								<p className="text-gray-700 mb-4">
									{bio || "No bio yet. Click edit to add one."}
								</p>
								<button
									onClick={() => setIsEditing(true)}
									className="px-6 py-2 border rounded-full hover:bg-gray-50 cursor-pointer"
								>
									Edit About
								</button>
							</div>
						) : (
							<div className="space-y-4">
								{/* Upload Photo */}
								<div className="flex items-center gap-2 mb-4">
									<label
										htmlFor="photo-upload"
										className="flex items-center gap-2 text-green-600 cursor-pointer hover:underline"
									>
										<div className="w-8 h-8 border border-green-600 rounded-full flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-4 h-4 text-green-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 11l2.5 3 3.5-4.5L20 17H4l4-6z"
												/>
											</svg>
										</div>
										<span>Insert photo</span>
									</label>
									<input
										id="photo-upload"
										type="file"
										accept="image/*"
										onChange={handlePhotoChange}
										className="hidden"
									/>
								</div>

								{/* Name */}
								<div>
									<label className="block text-sm font-medium mb-1">Name</label>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full border rounded-md p-2"
									/>
								</div>

								{/* Pronouns */}
								<div>
<<<<<<< Updated upstream
									<label className="block text-sm font-medium mb-1">Pronouns</label>
=======
									<label className="block text-sm font-medium mb-1">
										Pronouns
									</label>
>>>>>>> Stashed changes
									<input
										type="text"
										value={pronouns}
										onChange={(e) => setPronouns(e.target.value)}
										className="w-full border rounded-md p-2"
									/>
								</div>

								{/* Bio */}
								<div>
<<<<<<< Updated upstream
									<label className="block text-sm font-medium mb-1">Short bio</label>
=======
									<label className="block text-sm font-medium mb-1">
										Short bio
									</label>
>>>>>>> Stashed changes
									<textarea
										value={bio}
										onChange={(e) => setBio(e.target.value)}
										className="w-full border rounded-md p-2"
										rows={4}
									/>
								</div>

								{/* Actions */}
								<div className="flex justify-end gap-3 mt-4">
									<button
										onClick={() => setIsEditing(false)}
										className="px-6 py-2 border rounded-full"
									>
										Cancel
									</button>
									<button
										onClick={handleSave}
										className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
									>
										Save
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
