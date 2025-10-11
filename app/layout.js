"use client";
import { AuthModalProvider } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import "./globals.css";
import { Kalnia } from "next/font/google";
import PublicFooter from "@/components/PublicFooter";


const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${kalnia.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <AuthModalProvider>
          <main className="flex-1">{children}</main>
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
