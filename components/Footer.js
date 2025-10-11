"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Footer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full border-t bg-white shadow-md p-1 flex justify-between items-center z-50">
        {/* Burger Button */}
        

        {/* Footer Text */}
        <p className="text-lg md:text-xl lg:text-2xl text-center flex-1">
          This website was made by MAMA MO!
        </p>
      </footer>
    </>
  );
}
