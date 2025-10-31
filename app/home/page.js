"use client";

import { useState } from "react";
import Homeee from "@/components/Homeee";
import MediumSidebar from "@/components/Right-Sidebar";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 py-6 lg:py-8">
          <Homeee 
            selectedCategory={selectedCategory} 
            onClearCategory={() => setSelectedCategory(null)}
          />
        </div>

        {/* Sidebar (hidden on mobile) */}
        <aside className="w-full lg:w-80 flex-shrink-0 hidden lg:block border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0">
          <div className="sticky top-20 py-6 lg:py-8 max-h-[calc(100vh-5rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            <MediumSidebar 
              onCategorySelect={setSelectedCategory} 
              selectedCategory={selectedCategory} 
            />
          </div>
        </aside>
      </div>
    </div>
  );
}