"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out"
    >
      <i className="fi fi-rr-sign-out-alt text-lg flex-shrink-0"></i>
      <span className="text-base leading-none">Logout</span>
    </button>
  );
}