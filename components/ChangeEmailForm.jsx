"use client";

import React from "react";

export default function ChangeEmailForm({
  currentEmail,
  setCurrentEmail,
  password,
  setPassword,
  newEmail,
  setNewEmail,
  handleConfirm,
  setShowChangeEmail,
}) {
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
          onChange={(e) => setCurrentEmail(e.target.value)}
          placeholder="user@example.com"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black 
                      transition-colors duration-200
                      ${currentEmail.trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black
                      transition-colors duration-200
                      ${password.trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">New Email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-black
                      transition-colors duration-200
                      ${newEmail.trim() !== "" ? "text-black" : "text-gray-400"}`}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowChangeEmail(false)}
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
