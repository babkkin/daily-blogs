"use client";
import Homeee from '@/components/Homeee';
import React from 'react';
import MediumSidebar from "@/components/Right-Sidebar";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Main Content - Left Side */}
        <div className="flex-1">
          <Homeee />
        </div>

        {/* Sidebar - Right Side */}
        <aside className="w-80 flex-shrink-0 hidden lg:block border-l border-gray-200">
          <div className="sticky top-1">
            <MediumSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}