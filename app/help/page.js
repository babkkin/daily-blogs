"use client";
import React from "react";

export default function HelpPage() {
	return (
		<main className="max-w-3xl mx-auto px-4 py-16 text-gray-800">
			<h1 className="text-3xl font-bold text-center mb-10">
				Help & Frequently Asked Questions
			</h1>

			<div className="space-y-6">
				{/* 1 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I follow other writers?</p>
					<p>A: Yes! Visit any author’s profile and click the <strong>Follow</strong> button.</p>
				</div>

				{/* 2 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I save posts for later?</p>
					<p>A: Click the <strong>Bookmark</strong> icon under a post — it’ll be added to your <strong>Saved</strong> list.</p>
				</div>

				{/* 3 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I comment on an article?</p>
					<p>A: Scroll to the bottom of a post, type your comment, and press <strong>Post Comment</strong>.</p>
				</div>

				{/* 4 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I delete my account?</p>
					<p>A: Yes, go to <strong>Settings → Delete Account</strong>. This action is permanent.</p>
				</div>

				{/* 5 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: What should I do if I forget my password?</p>
					<p>A: Click <strong>Forgot Password</strong> on the login page to reset it via email.</p>
				</div>

				{/* 6 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I report an inappropriate post or comment?</p>
					<p>A: Click the <strong>Report</strong> button below the post or comment and select a reason.</p>
				</div>

				{/* 7 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Is my data private?</p>
					<p>A: Yes! We value your privacy and use encrypted systems to protect your personal data.</p>
				</div>

				{/* 8 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I contact support?</p>
					<p>
						A: You can email us at <strong>strong@ko.com</strong> or use the{" "}
						<strong>Contact</strong> form in the footer.
					</p>
				</div>

				{/* 9 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I share posts on social media?</p>
					<p>
						A: Absolutely! Click the <strong>Share</strong> button on a post to share it on your favorite
						platform.
					</p>
				</div>

				{/* 10 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Why can’t I see my post right away?</p>
					<p>A: Some posts may go through a short review process before being visible to the public.</p>
				</div>

				{/* 11 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I edit a post after publishing?</p>
					<p>A: Go to your post and click the <strong>Edit</strong> option in the menu.</p>
				</div>

				{/* 12 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I disable comments on my post?</p>
					<p>A: Yes. When creating or editing your post, toggle the <strong>Allow Comments</strong> setting.</p>
				</div>

				{/* 13 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I mention or tag other users?</p>
					<p>A: Type <strong>@username</strong> in your post or comment to tag someone.</p>
				</div>

				{/* 14 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I change my username or profile picture?</p>
					<p>A: Yes, go to <strong>Settings → Profile</strong> and update your info.</p>
				</div>

				{/* 15 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I enable dark mode?</p>
					<p>A: Click your profile icon, then select <strong>Theme → Dark Mode</strong>.</p>
				</div>

				{/* 16 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Can I post images or videos?</p>
					<p>A: Yes! Use the <strong>Add Media</strong> icon in the post editor to upload media files.</p>
				</div>

				{/* 17 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: What should I do if the site isn’t loading?</p>
					<p>A: Try refreshing the page or clearing your browser cache. If it continues, contact support.</p>
				</div>

				{/* 18 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: Which browsers are supported?</p>
					<p>A: We recommend using the latest versions of Chrome, Firefox, Safari, or Edge.</p>
				</div>

				{/* 19 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How do I change my password?</p>
					<p>A: Go to <strong>Settings → Security → Change Password</strong> to update it.</p>
				</div>

				{/* 20 */}
				<div className="border-b border-gray-300 pb-4">
					<p className="font-semibold">Q: How can I give feedback or suggest new features?</p>
					<p>A: Visit our <strong>Feedback</strong> page or email us directly with your suggestions.</p>
				</div>
			</div>
		</main>
	);
}
