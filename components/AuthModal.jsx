"use client";
import React from "react";
import { useAuthModal } from "./AuthModalProvider";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { signIn } from "next-auth/react";

export default function AuthModal() {
  const { isOpen, authType, closeModal, openModal } = useAuthModal();

  // close on ESC
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      {/* modal box */}
      <div
        className="relative max-w-md mx-auto bg-white rounded-xl p-6 shadow-2xl z-10"
        style={{ marginTop: "28vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="float-right mr-4 right-3 text-2xl text-gray-500 hover:text-black"
          onClick={closeModal}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {authType === "login" ? "Welcome back" : "Join DailyBlogs"}
        </h2>

        {/* Google button (placeholder) */}
        <button
          onClick={() => signIn("google")}
          className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-4"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="my-3 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* login / signup form */}
        {authType === "login" ? <LoginForm /> : <SignupForm />}

        {/* toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => openModal(authType === "login" ? "signup" : "login")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {authType === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

