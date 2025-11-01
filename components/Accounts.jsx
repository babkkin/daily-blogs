"use client";

import React from "react";

export default function Accounts({
  section,
  currentEmail = "",
  setCurrentEmail,
  password = "",
  setPassword,
  newEmail = "",
  setNewEmail,
  handleConfirm,
  setActiveSection,
}) {
  // Conditional render depending on section type
  if (section === "deactivate") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Account deactivation confirmed!");
          setActiveSection(null);
        }}
        className="bg-gray-50 p-4 rounded-lg shadow-sm border mt-2"
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to deactivate your account? You can reactivate
          it anytime by signing back in.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword?.(e.target.value)}
            placeholder="Enter your password"
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black 
                        transition-colors duration-200
                        ${(password ?? "").trim() !== "" ? "text-black" : "text-gray-400"}`}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-red-600 text-white border border-red-600 
                      hover:!bg-white hover:!text-red-600 transition-colors duration-200"
          >
            Confirm
          </button>
        </div>
      </form>
    );
  }

  if (section === "delete") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Account deletion confirmed!");
          setActiveSection(null);
        }}
        className="bg-gray-50 p-4 rounded-lg shadow-sm border mt-2"
      >
        <p className="text-sm text-gray-700 mb-4">
          This action is permanent and cannot be undone. Are you sure you want
          to delete your account?
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword?.(e.target.value)}
            placeholder="Enter your password"
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black 
                        transition-colors duration-200
                        ${(password ?? "").trim() !== "" ? "text-black" : "text-gray-400"}`}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-red-600 text-white border border-red-600 
                      hover:!bg-white hover:!text-red-600 transition-colors duration-200"
          >
            Confirm
          </button>
        </div>
      </form>
    );
  }

  // Default: Change email form
  return (
    <form
      onSubmit={handleConfirm}
      className="bg-gray-50 p-4 rounded-lg shadow-sm border mt-2"
    >
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">
          Current Email
        </label>
        <input
          type="email"
          value={currentEmail}
          onChange={(e) => setCurrentEmail?.(e.target.value)}
          placeholder="user@example.com"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black 
                      transition-colors duration-200
                      ${(currentEmail ?? "").trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword?.(e.target.value)}
          placeholder="Enter your password"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black
                      transition-colors duration-200
                      ${(password ?? "").trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">New Email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail?.(e.target.value)}
          placeholder="Enter new email"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black
                      transition-colors duration-200
                      ${(newEmail ?? "").trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setActiveSection(null)}
          className="px-4 py-2 rounded-md bg-red-600 text-white border border-red-600 
                    hover:!bg-white hover:!text-red-600 transition-colors duration-200 
                    focus:outline-none cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-green-600 text-white border border-green-600 
                    hover:!bg-white hover:!text-green-600 transition-colors duration-200 
                    focus:outline-none cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </form>
  );
}
