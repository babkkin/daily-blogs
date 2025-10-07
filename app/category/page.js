"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const [visibleCount, setVisibleCount] = useState(9);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleCategory = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const loadMore = () => setVisibleCount((prev) => prev + 2);

  const handleDone = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/save-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: selected }),
      });

      if (!res.ok) throw new Error("Failed to save categories");

      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("Error saving your preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="block text-3xl font-semibold">
          What content would you like to see?
        </h1>
        <p className="text-xl mb-4">Choose from the following</p>

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

        <div className="mt-6 flex justify-center gap-4">
          {/* Skip button */}
          <button
            onClick={handleSkip}
            disabled={loading}
            className="px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Skip
          </button>

          {/* Done button */}
          <button
            onClick={handleDone}
            disabled={loading || selected.length === 0}
            className={`px-6 py-3 rounded-lg transition ${
              loading || selected.length === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
