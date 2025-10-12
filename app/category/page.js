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

  if (step === 1) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
          <h1 className="text-3xl font-semibold mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-6">Please set up your account.</p>

          <div className="flex flex-col items-center mb-5">
            <label htmlFor="fileInput" className="cursor-pointer relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-400">
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
            className="w-full p-3 rounded-md text-center outline-none border border-gray-300"
          />

          <button
            onClick={handleNext}
            className="mt-5 w-full py-3 rounded-md text-white bg-black hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="block text-3xl font-semibold">Hi {username}! 👋</h1>
        <p className="text-xl mb-4">What content would you like to see?</p>

        <div className="grid grid-cols-3 gap-4 p-6 max-w-4xl">
          {allCategories.slice(0, visibleCount).map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`border-2 rounded-lg p-2 text-center font-semibold text-lg transition-colors ${
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
          <button
            onClick={handleSkip}
            className="px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Skip
          </button>

          <button
            onClick={handleDone}
            className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
