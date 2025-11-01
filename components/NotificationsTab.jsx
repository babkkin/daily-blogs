"use client";

import { useState } from "react";

export default function NotificationsTab() {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    security: true,
    updates: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    alert("Notification preferences saved!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Notifications</h2>
      <p className="text-gray-600 mb-4">
        Choose which notifications you’d like to receive.
      </p>

      <div className="space-y-3 border-t pt-3">
        <label className="flex justify-between items-center">
          <span>Email notifications</span>
          <input
            type="checkbox"
            checked={settings.email}
            onChange={() => handleToggle("email")}
            className="accent-green-600 w-4 h-4"
          />
        </label>

        <label className="flex justify-between items-center">
          <span>Push notifications</span>
          <input
            type="checkbox"
            checked={settings.push}
            onChange={() => handleToggle("push")}
            className="accent-green-600 w-4 h-4"
          />
        </label>

        <label className="flex justify-between items-center">
          <span>Security alerts</span>
          <input
            type="checkbox"
            checked={settings.security}
            onChange={() => handleToggle("security")}
            className="accent-green-600 w-4 h-4"
          />
        </label>

        <label className="flex justify-between items-center">
          <span>Product updates & announcements</span>
          <input
            type="checkbox"
            checked={settings.updates}
            onChange={() => handleToggle("updates")}
            className="accent-green-600 w-4 h-4"
          />
        </label>
      </div>

      <button
        onClick={handleSave}
        className="mt-5 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-white hover:text-green-600 border border-green-600 transition"
      >
        Save changes
      </button>
    </div>
  );
}

