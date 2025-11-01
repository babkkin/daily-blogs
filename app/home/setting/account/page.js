"use client";

import { useState } from "react";
import Accounts from "@/components/Accounts";
import NotificationsTab from "@/components/NotificationsTab";
import PrivacyTab from "@/components/PrivacyTab";
import { Mail } from "lucide-react";

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


function AccountTab() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Email Address */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div>
          <p className="font-medium text-gray-900">Email address</p>
        </div>
        <div
          className="hover:bg-gray-200 hover:rounded-full px-2 py-1 cursor-pointer transition-all duration-200"
          onClick={() => toggleSection("change")}
        >
          <p className="text-red-600">Change</p>
        </div>
      </div>

      {activeSection === "change" && (
        <Accounts section="change" setActiveSection={setActiveSection} />
      )}

      {/* Deactivate Account */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div>
          <p className="text-red-600 font-medium">Deactivate account</p>
          <p className="text-sm text-gray-500 font-normal">
            Deactivating will suspend your account until you sign back in.
          </p>
        </div>
        <div
          className="hover:bg-gray-200 hover:rounded-full px-2 py-1 cursor-pointer transition-all duration-200"
          onClick={() => toggleSection("deactivate")}
        >
          <p className="text-red-600">Deactivate</p>
        </div>
      </div>

      {activeSection === "deactivate" && (
        <Accounts section="deactivate" setActiveSection={setActiveSection} />
      )}

      {/* Delete Account */}
      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <div>
          <p className="text-red-600 font-medium">Delete account</p>
          <p className="text-sm text-gray-500 font-normal">
            Permanently delete your account and all of your content.
          </p>
        </div>
        <div
          className="hover:bg-gray-200 hover:rounded-full px-2 py-1 cursor-pointer transition-all duration-200"
          onClick={() => toggleSection("delete")}
        >
          <p className="text-red-600">Delete</p>
        </div>
      </div>

      {activeSection === "delete" && (
        <Accounts section="delete" setActiveSection={setActiveSection} />
      )}
    </div>
  );
}
