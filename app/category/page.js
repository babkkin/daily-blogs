"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selected, setSelected] = useState([]);
  const router = useRouter();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const handleNext = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("photo", photoFile);

    await fetch("/api/save-username", {
      method: "POST",
      body: formData,
    });

    setStep(2);
  };

  const toggleCategory = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const loadMore = () => setVisibleCount((prev) => prev + 2);

  const handleDone = async () => {
    await fetch("/api/save-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, categories: selected }),
    });
    router.push("/home");
  };

  const handleSkip = () => router.push("/home");

  // STEP 1: Username + Photo
  if (step === 1) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Please set up your account.</p>

          <div className="flex flex-col items-center mb-5">
            <label htmlFor="fileInput" className="cursor-pointer relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-400">
                {photo ? (
                  <Image
                    width={128}
                    height={128}
                    src={photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-3xl font-bold">+</span>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-3 rounded-md text-center outline-none border border-gray-300 text-sm sm:text-base"
          />

          <button
            onClick={handleNext}
            disabled={!username}
            className={`mt-5 w-full py-3 rounded-md text-white transition ${
              username ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: Category Selection
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Hi {username}! 👋</h1>
        <p className="text-base sm:text-lg mb-4">What content would you like to see?</p>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
          {allCategories.slice(0, visibleCount).map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`border-2 rounded-lg p-2 sm:p-3 text-sm sm:text-base font-semibold transition-colors ${
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
              className="border-2 border-dashed rounded-lg p-2 sm:p-3 text-center text-lg font-bold hover:bg-gray-100"
            >
              +
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={handleSkip}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Skip
          </button>

          <button
            onClick={handleDone}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
