"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Compass,Bookmark,Info,User,Home} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch("/api/blogs/user/following");
        const data = await res.json();
        if (data.success) {
          setFollowing(data.following);
        }
      } catch (err) {
        console.error("Failed to fetch following:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFollowing();
    }
  }, [isOpen]);

  const displayedFollowing = showAll ? following : following.slice(0, 5);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full max-h-full overflow-y-auto 
                w-[14vw] bg-white text-gray-800 shadow-lg z-50 flex flex-col justify-between"
      style={{ boxShadow: '2px 0 5px rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div>
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold"></h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 transition"
          >
            &times;
          </button>
        </div>

        {/* Navigation */}
        <ul className="p-6 space-y-2 mt-[3vh]">
          {/* 🏠 Home */}
          <Link href="/home" className="block">
            <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                <Home size={18} className="text-xl flex-shrink-0" />
              <span className="text-xl leading-none">Home</span>
            </li>
          </Link>

          {/* 👤 Profile */}
          <Link
            href={session?.user?.id ? `/profile/${session.user.id}` : "/profile"}
            className="block"
          >
            <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                <User size={18} className="text-xl flex-shrink-0" />
              <span className="text-xl leading-none">Profile</span>
            </li>
          </Link>

           {/* ℹ️ Discovery */}
            <Link href="#" className="block" onClick={() => alert("Discovery placeholder")}>
            <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                <Compass size={18} className="text-xl flex-shrink-0" />
              <span className="text-xl leading-none">Discovery</span>
            </li>
          </Link>         

          {/* 🔖 Bookmark */}
          <Link href="/bookmarks" className="block">
            <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                <Bookmark size={18} className="text-xl flex-shrink-0" />
              <span className="text-xl leading-none">Bookmark</span>
            </li>
          </Link>

          {/* ℹ️ About */}
          <Link href="/about" className="block" >
            <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                <Info size={18} className="text-xl flex-shrink-0" />
              <span className="text-xl leading-none">About</span>
            </li>
          </Link>



          </ul>

          {/* ⚙️ Settings with dropdown 
          <li
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center justify-between gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center gap-3">
              <i className="fi fi-rr-settings text-xl flex-shrink-0"></i>
              <span className="text-xl leading-none">Settings</span>
            </div>
            <i
              className={`fi fi-rr-angle-${settingsOpen ? "small-up" : "small-down"} text-sm transition-transform duration-300`}
            ></i>
          </li>

          {/* Smooth Dropdown Animation *}
          <AnimatePresence>
            {settingsOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="ml-8 mt-3 space-y-2"
              >
                {[
                  { href: "/home/setting/account", label: "Account" },
                  { href: "/home/setting/privacy", label: "Privacy" },
                  { href: "/home/setting/notifications", label: "Notifications" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <li className="flex items-center gap-3 p-3 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out">
                      {label}
                    </li>
                  </Link>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </ul>*/}

        {/* Following Section */}
        <div className="font-medium text-xl text-gray-900/90 border-t border-gray-200 mt-[3vh] ml-[2vh]">
          <div className="flex items-center gap-3 p-3 pt-10 pb-4">
            <i className="fi fi-rr-following text-xl flex-shrink-0"></i>
            <span className="text-xl leading-none">
              Following ({following.length})
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 px-3">Loading...</p>
          ) : following.length === 0 ? (
            <p className="text-sm text-gray-500 px-3">
              Not following anyone yet
            </p>
          ) : (
            <div className="space-y-2">
              {displayedFollowing.map((user) => (
                <Link
                  key={user.user_id}
                  href={`/profile/${user.user_id}`}
                  className="flex items-center gap-3 p-2 border border-transparent text-gray-900/90 hover:mask-r-from-20% hover:border-black border-r-0 border-t-0 border-b-0 hover:bg-gray-100 hover:text-black cursor-pointer transition-all duration-300 ease-in-out"
                >
                  {user.profile_url ? (
                    <Image
                      src={user.profile_url}
                      alt={user.user_name}
                      width={32}
                      height={32}
                      className="w-7 h-7 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.user_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium truncate">
                    {user.user_name}
                  </span>
                </Link>
              ))}

              {following.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 py-2 text-left px-2"
                >
                  {showAll ? "Show less" : `Show ${following.length - 5} more`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
