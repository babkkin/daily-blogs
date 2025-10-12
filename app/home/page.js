"use client";
import Homeee from "@/components/Homeee";
import React from "react";
import MediumSidebar from "@/components/Right-Sidebar";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 py-6 lg:py-8">
          <Homeee />
        </div>

        {/* Sidebar (hidden on mobile) */}
        <aside className="w-full lg:w-80 flex-shrink-0 hidden lg:block border-t lg:border-t-0 lg:border-l border-gray-200 mt-6 lg:mt-0">
          <div className="sticky top-20 py-6 lg:py-8">
            <MediumSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
