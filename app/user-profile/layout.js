"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
