"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Bookmark } from "lucide-react";

export default function DiscoveryPage() {
 const [blogs, setBlogs] = useState([]);
 const [filteredBlogs, setFilteredBlogs] = useState([]);
 const [selectedCategory, setSelectedCategory] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const categoryScrollRef = useRef(null);

 const categories = [
  "Technology","Health & Wellness","Travel","Food","Lifestyle",
  "Education","Finance","Entertainment","Science","Sports",
  "Music","Gaming","History","Art & Design","News & Politics","Others"
 ];

 const options = { year: "numeric", month: "short", day: "numeric" };

 useEffect(() => {
  const fetchBlogs = async () => {
   setLoading(true);
   setError("");
   try {
    const res = await fetch("/api/blogs", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch blogs");

    const data = await res.json();
    if (data.success) {
     setBlogs(data.blogs);
     setFilteredBlogs(data.blogs);
    } else {
     setError(data.error || "Server returned an error.");
    }
   } catch (err) {
    setError(err.message);
   } finally {
    setLoading(false);
   }
  };
  fetchBlogs();
 }, []);

 // ✅ Fixed Filtering with exact match
 useEffect(() => {
  if (!selectedCategory) {
   setFilteredBlogs(blogs);
  } else {
   setFilteredBlogs(
    blogs.filter(
     (b) => b.category && b.category === selectedCategory
    )
   );
  }
 }, [selectedCategory, blogs]);

 // ✅ Toggle category on click (like sidebar)
 const handleCategoryClick = (category) => {
  setSelectedCategory((prev) => (prev === category ? null : category));
 };

 const scrollCategories = (direction) => {
  if (!categoryScrollRef.current) return;
  const scrollAmount = 220;
  categoryScrollRef.current.scrollBy({
   left: direction === "left" ? -scrollAmount : scrollAmount,
   behavior: "smooth",
  });
 };

 if (loading)
  return (
   <div className="flex items-center justify-center h-screen">
    <div className="text-center space-y-6">
     <div className="w-20 h-20 border-4 border-t-black border-gray-300 rounded-full animate-spin mx-auto" />
     <p className="text-xl font-semibold">Loading Discovery...</p>
    </div>
   </div>
  );

 if (error)
  return (
   <div className="flex items-center justify-center h-screen text-red-500 text-xl">
    Error: {error}
   </div>
  );

 return (
  <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-10 sm:pt-5 pb-10">
   <h1 className="font-semibold text-2xl mb-6 text-gray-900">Discover</h1>

   {/* Category Row */}
   <div className="relative mb-10">
    <button
     onClick={() => scrollCategories("left")}
     className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:bg-gray-100"
    >
     <ChevronLeft size={20} />
    </button>

    <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
    <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />

    <div
     ref={categoryScrollRef}
     className="flex gap-3 overflow-x-auto scroll-smooth px-12 no-scrollbar"
     style={{ WebkitOverflowScrolling: "touch" }}
    >
     {categories.map((cat) => (
      <button
       key={cat}
       onClick={() => handleCategoryClick(cat)}
       className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
        selectedCategory === cat
         ? "bg-black text-white"
         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
       }`}
      >
       {cat}
      </button>
     ))}
    </div>

    <button
     onClick={() => scrollCategories("right")}
     className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:bg-gray-100"
    >
     <ChevronRight size={20} />
    </button>
   </div>

   {/* Blog List */}
   {filteredBlogs.length === 0 ? (
    <div className="text-center py-16 text-gray-500 text-lg">
     {selectedCategory
      ? `No posts found in the ${selectedCategory} category.`
      : "No posts available yet."}
    </div>
   ) : (
    <div className="flex flex-col gap-10">
     {filteredBlogs.map((blog) => (
      <Link
       key={blog._id || blog.id}
       href={`/blogs/${blog._id || blog.id || ""}`}
       className="group flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-200 pb-8 hover:bg-gray-50 transition-all rounded-xl p-4"
      >
       <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1 mt-3 sm:mt-4">
         by{" "}
         <span className="text-gray-700 font-semibold">
          {blog.user_name}
         </span>
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 group-hover:text-black transition-colors break-words">
         {blog.title}
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl mt-1 line-clamp-2 break-words">
         {blog.subtitle || "No description provided."}
        </p>

        <div className="flex items-center gap-4 mt-3">
         <p className="text-gray-400 text-sm">
          {blog.created_at
           ? new Date(blog.created_at).toLocaleDateString("en-US", options)
           : ""}
         </p>
         <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
           <Heart size={16} /> {blog.claps_count || 0}
          </span>
          <span className="flex items-center gap-1">
           <MessageCircle size={16} /> {blog.comments_count || 0}
          </span>
          <span className="flex items-center gap-1">
           <Bookmark size={16} /> {blog.bookmarks_count || 0}
          </span>
         </div>
        </div>
       </div>

       {blog.image_url && (
        <div className="w-full sm:w-48 md:w-56 h-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-md">
         <Image
          src={blog.image_url}
          alt={blog.title}
          width={400}
          height={250}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
         />
        </div>
       )}
      </Link>
     ))}
    </div>
   )}
  </div>
 );
}