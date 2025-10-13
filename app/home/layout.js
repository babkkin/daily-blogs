"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 pt-10 transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
