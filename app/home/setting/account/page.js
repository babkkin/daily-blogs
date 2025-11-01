"use client";

import { useState } from "react";
import ChangeEmailForm from "@/components/ChangeEmailForm";
import {
  User,
  Lock,
  Mail,
  Image as ImageIcon,
  Bell,
  CreditCard,
  Shield,
} from "lucide-react";

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

// ✅ FIX: Add `useState` import in each component that uses hooks
function AccountTab() {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleConfirm = (e) => {
    e.preventDefault();
    alert("Email change request submitted!");
    setShowChangeEmail(false);
  };

  const handleDeactivate = (e) => {
    e.preventDefault();
    alert("Account deactivation confirmed!");
    setShowDeactivate(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    alert("Account deletion confirmed!");
    setShowDelete(false);
  };

  // helper to close all forms before opening another
  const closeAll = () => {
    setShowChangeEmail(false);
    setShowDeactivate(false);
    setShowDelete(false);
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
          onClick={() => {
            closeAll();
            setShowChangeEmail(true);
          }}
        >
          <p className="text-red-600">Change</p>
        </div>
      </div>

      {/* Change Email Form */}
      {showChangeEmail && (
        <ChangeEmailForm
          currentEmail={currentEmail}
          setCurrentEmail={setCurrentEmail}
          password={password}
          setPassword={setPassword}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          handleConfirm={handleConfirm}
          setShowChangeEmail={setShowChangeEmail}
        />
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
          onClick={() => {
            closeAll();
            setShowDeactivate(true);
          }}
        >
          <p className="text-red-600">Deactivate</p>
        </div>
      </div>

      {/* Deactivate Confirmation */}
      {showDeactivate && (
        <form
          onSubmit={handleDeactivate}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border mt-2"
        >
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to deactivate your account? You can reactivate
            it anytime by signing back in.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDeactivate(false)}
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
          onClick={() => {
            closeAll();
            setShowDelete(true);
          }}
        >
          <p className="text-red-600">Delete</p>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDelete && (
        <form
          onSubmit={handleDelete}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border mt-2"
        >
          <p className="text-sm text-gray-700 mb-4">
            This action is permanent and cannot be undone. Are you sure you want
            to delete your account?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDelete(false)}
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
      )}
    </div>
  );
}
