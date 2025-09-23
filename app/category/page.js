"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";   // ✅ added this

export default function CategorySelector() {
  const allCategories = [
    "Technology",
    "Health & Wellness",
    "Travel",
    "Food",
    "Lifestyle",
    "Education",
    "Finance",
    "Entertainment",
    "Science",
    "Sports",
    "Music",
    "Gaming",
    "History",
    "Art & Design",
    "News & Politics",
  ];

  const [visibleCount, setVisibleCount] = useState(9); // show first 9 initially
  const [selected, setSelected] = useState([]);
  const router = useRouter();   // ✅ added this

  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((c) => c !== category));
    } else if (selected.length >= 0) {
      setSelected([...selected, category]);
    }
  };

    // ✅ new function
  const handleDone = () => {
    router.push("/home");
  };


  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="block text-3xl font-semibold">
          What content would you like to see?
        </h1>
        <p className="text-xl mb-4">Choose from the following           </p>

        <div className="grid grid-cols-3 gap-4 p-6 max-w-4xl">
          {allCategories.slice(0, visibleCount).map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`border-2 rounded-lg p-2 text-center font-semibold text-lg transition-colors
                ${
                  selected.includes(category)
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              {category}
            </button>
          ))}

          {visibleCount < allCategories.length && (
            <button
              onClick={loadMore}
              className="border-2 border-dashed rounded-lg p-2 text-center text-lg font-bold hover:bg-gray-100"
            >
              +
            </button>
          )}
        </div>
        {/* ✅ New Done button block */}
        <button
          onClick={handleDone}
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
