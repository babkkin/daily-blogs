"use client";

import { useState } from "react";
import { User, Lock, Mail, Image as ImageIcon, Bell, CreditCard, Shield } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-[8vh]">
      {/* Header */}
      <h1 className="text-4xl font-semibold mb-8">Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-black font-medium text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "account" && <AccountTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "privacy" && <PrivacyTab />}
    </div>
  );
}

// Account Tab
function AccountTab() {
  return (
    <div className="space-y-6">
      {/* Email Address */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div>
          <p className="font-medium text-gray-900">Email address</p>
        </div>
        <p className="text-gray-600"></p>
      </div>

      {/* Danger Zone */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
        <div className="text-red-600 hover:text-red-700 font-medium">
          Deactivate account
          <p className="text-sm text-gray-500 font-normal">Deactivating will suspend your account until you sign back in.</p>
        </div>
      </div>

        
      <div className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
        <div className="text-red-600 hover:text-red-700 font-medium">
          Delete account
          <p className="text-sm text-gray-500 font-normal">Permanently delete your account and all of your content.</p>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return <div className="text-gray-600">Notification settings coming soon...</div>;
}

function PrivacyTab() {
  return <div className="text-gray-600">Privacy settings coming soon...</div>;
}
