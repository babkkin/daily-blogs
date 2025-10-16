"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Compass, MoveUpRight, User, SquarePen } from "lucide-react";
import Link from "next/link";

export default function BetterSearchUI() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ authors: [], blogs: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Close Discovery dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ authors: [], blogs: [] });
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/blogs/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults({
            authors: data.authors || [],
            blogs: data.blogs || [],
          });
          setShowDropdown(true);
          setShowSearchDropdown(false);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchResults();
  }, [searchQuery]);

  // Close results dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults({ authors: [], blogs: [] });
      setShowDropdown(false);
    }
  };

  const handleBlogClick = (id) => {
    router.push(`/blogs/${id}`);
    setSearchQuery("");
    setSearchResults({ authors: [], blogs: [] });
    setShowDropdown(false);
  };

  const handleAuthorClick = (userId) => {
    router.push(`/profile/${userId}`);
    setSearchQuery("");
    setSearchResults({ authors: [], blogs: [] });
    setShowDropdown(false);
  };

  const handleInputClick = () => {
    if (searchResults.authors.length > 0 || searchResults.blogs.length > 0) {
      setShowDropdown(true);
    } else if (searchQuery.trim() === "") {
      setShowSearchDropdown(!showSearchDropdown);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") setShowSearchDropdown(false);
  };

  return (
    <div className="relative flex-1" ref={searchDropdownRef}>
      {/* ===== Desktop Search ===== */}
      <div className="hidden sm:block">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-gray-100/30 rounded-full px-3 py-3 w-[250px] focus-within:ring-1 focus-within:ring-black transition text-gray-800/70 hover:text-black"
        >
          <Search size={18} />
          <input
            onClick={handleInputClick}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
            className="bg-transparent outline-none px-2 w-full text-sm sm:text-base"
          />
        </form>
      </div>

      {/* ===== Mobile Search ===== */}
      <div className="block sm:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-gray-100/30 rounded-full px-3 py-2 w-full focus-within:ring-1 focus-within:ring-black transition"
        >
          <Search size={18} className="text-gray-500" />
          <input
            onClick={handleInputClick}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
            className="bg-transparent outline-none px-2 w-full text-sm"
          />
        </form>
      </div>

      {/* ===== Discovery Dropdown ===== */}
      {showSearchDropdown && (
        <div className="absolute left-0 mt-2 w-80 pt-8 pb-8 pl-5 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Link
            href="#"
            onClick={() => {
              setShowSearchDropdown(false);
              alert("Discovery Placeholder");
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition w-full"
          >
            <div className="flex items-center justify-between w-full px-3 py-1 text-gray-800/70 hover:text-black">
              <div className="flex items-center gap-2">
                <Compass size={18} className="flex-shrink-0" />
                <p className="text-sm">Explore Discovery</p>
              </div>
              <MoveUpRight size={16} className="flex-shrink-0 mr-3" />
            </div>
          </Link>
        </div>
      )}

      {/* ===== Search Results Dropdown ===== */}
      {showDropdown && (searchResults.authors.length > 0 || searchResults.blogs.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 bg-white border mt-1 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50"
        >
          {/* --- Authors --- */}
          {searchResults.authors.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-3 py-2 bg-gray-50 flex items-center gap-2">
                <User size={16} className="text-gray-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Authors</span>
              </div>
              <ul>
                {searchResults.authors.map((author) => (
                  <li
                    key={author.userId}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                    onClick={() => handleAuthorClick(author.userId)}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center flex-shrink-0">
                      {author.profile_url ? (
                        <Image
                          src={author.profile_url}
                          alt={author.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {author.name ? author.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{author.name}</span>
                      {author.bio && (
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{author.bio}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- Blogs --- */}
          {searchResults.blogs.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 flex items-center gap-2">
                <SquarePen size={16} className="text-gray-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">Blogs</span>
              </div>
              <ul>
                {searchResults.blogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => handleBlogClick(blog.id)}
                  >
                    {blog.image_url && (
                      <Image
                        width={40}
                        height={40}
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-10 h-10 object-cover rounded"
                        unoptimized
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm sm:text-base">{blog.title}</span>
                      <span className="text-xs text-gray-500">{blog.author_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ===== No Results Message ===== */}
      {showDropdown &&
        searchQuery.trim() !== "" &&
        searchResults.authors.length === 0 &&
        searchResults.blogs.length === 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 bg-white border mt-1 rounded-md shadow-lg p-4 z-50"
          >
            <p className="text-center text-gray-500 text-sm">
              No results found for `{searchQuery}`
            </p>
          </div>
        )}
    </div>
  );
}
