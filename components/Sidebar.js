"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Home", icon: "fi fi-rr-home", path: "/home" },
    { name: "Library", icon: "fi fi-rr-book-alt", path: "/library" },
    { name: "Profile", icon: "fi fi-rr-user", path: "/profile" },
    { name: "Stories", icon: "fi fi-rr-document", path: "/stories" },
    { name: "Stats", icon: "fi fi-rr-chart-histogram", path: "/stats" },
  ];

  // 🧩 Close sidebar when route changes
  useEffect(() => {
    if (onClose) onClose(); // ✅ avoid undefined
  }, [pathname]);

  return (
    <div
      className={`fixed top-[49px] left-0 h-[calc(100%-64px)] w-64 bg-white shadow-lg p-5 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >


      <ul className="space-y-4">
        {links.map((link) => (
          <li
            key={link.path}
            onClick={() => router.push(link.path)}
            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-colors ${
              pathname === link.path
                ? "bg-gray-100 text-black font-semibold"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <i className={link.icon}></i> {link.name}
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t pt-4">
        <p className="text-sm font-semibold mb-2">Following</p>
        <ul className="space-y-1">
          <li className="text-sm text-gray-600">StartupInsider</li>
          <li className="text-sm text-gray-600">Stackademic</li>
          <li className="text-sm text-gray-600">Frontend Highlights</li>
        </ul>
      </div>
    </div>
  );
}
