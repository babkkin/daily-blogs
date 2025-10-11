"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "General Settings",
    items: [
      "Site Title",
      "Tagline / Description",
      "Logo Upload",
      "Favicon Upload",
      "Timezone",
      "Language",
      "Date & Time Format",
    ],
  },
  {
    title: "User Settings",
    items: [
      "Profile Picture",
      "Display Name",
      "Bio / About",
      "Email Notifications",
      "Theme Preference (Light / Dark Mode)",
    ],
  },
  {
    title: "Blog Post Settings",
    items: [
      "Default Post Visibility",
      "Default Category",
      "Number of Posts per Page",
      "Allow Comments",
      "Auto Save Drafts",
      "Featured Image Required",
    ],
  },
  {
    title: "Comments Settings",
    items: [
      "Enable / Disable Comments",
      "Require Approval Before Display",
      "Allow Guest Comments",
      "Profanity Filter",
      "Email Moderation Alerts",
    ],
  },
  {
    title: "Appearance Settings",
    items: [
      "Theme / Template Selector",
      "Primary Color",
      "Accent Color",
      "Font Family / Size",
      "Header & Footer Custom Text",
      "Layout Options",
    ],
  },
  {
    title: "Privacy & Security Settings",
    items: [
      "Cookie Consent Banner",
      "Content Privacy Options",
      "Two-Factor Authentication",
      "Backup & Export Data",
    ],
  },
  {
    title: "SEO & Sharing",
    items: [
      "Meta Title & Description",
      "Social Media Links",
      "Open Graph Image",
      "RSS Feed Toggle",
      "Custom Robots.txt",
      "Sitemap Generation",
    ],
  },
];

export default function SettingsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Settings</h1>

      {sections.map((section, index) => (
        <div
          key={index}
          className="border rounded-xl mb-3 overflow-hidden shadow-sm"
        >
          {/* Section Header */}
          <button
            onClick={() => toggle(index)}
            className="w-full text-left px-5 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
          >
            <span className="font-medium text-base">{section.title}</span>
            <motion.span
              animate={{ rotate: openIndex === index ? 90 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-gray-700"
            >
              ▶
            </motion.span>
          </button>

          {/* Dropdown Content */}
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-3 bg-white"
              >
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
