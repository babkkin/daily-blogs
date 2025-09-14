"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">You are not signed in</h1>
        <Link
          href="/auth/signin"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Go to Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session.user?.email} 👋</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </header>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Posts</h2>
          <p className="text-gray-600">You haven’t written anything yet. ✍️</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Your Account</h2>
          <p className="text-gray-600">Manage your profile, settings, and more.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Explore Blogs</h2>
          <p className="text-gray-600">See what others are writing about! 🔍</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">You are not signed in</h1>
        <Link
          href="/auth/signin"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Go to Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session.user?.email} 👋</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </header>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Posts</h2>
          <p className="text-gray-600">You haven’t written anything yet. ✍️</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Your Account</h2>
          <p className="text-gray-600">Manage your profile, settings, and more.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Explore Blogs</h2>
          <p className="text-gray-600">See what others are writing about! 🔍</p>
        </div>
      </div>
    </div>
  );
}
