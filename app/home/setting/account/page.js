"use client";

import { User, Lock, Mail, Palette, Image as ImageIcon } from "lucide-react";

export default function AccountSettings() {
  const userOptions = [
    { label: "Edit Username", icon: <User className="w-5 h-5 text-black" /> },
    { label: "Change Password", icon: <Lock className="w-5 h-5 text-black" /> },
    { label: "Update Email", icon: <Mail className="w-5 h-5 text-black" /> },
    { label: "Profile Picture", icon: <ImageIcon className="w-5 h-5 text-black" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-900">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-left">Account Settings</h1>
      <p className="text-gray-600 mb-8 text-left">
        Manage your personal information, password, and appearance preferences.
      </p>

      {/* Settings Box */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="space-y-1">
          {userOptions.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-sm border-l-2 border-transparent hover:border-black hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out"
            >
              {item.icon}
              <span className="text-base font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
