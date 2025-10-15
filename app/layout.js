"use client";
import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/components/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import "./globals.css";
import { Kalnia, Poppins } from "next/font/google";

const kalnia = Kalnia({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-kalnia",
});

const lato = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body
  className={`${kalnia.variable} ${lato.variable} min-h-screen flex flex-col transition-colors duration-300 bg-white`}
>

        <SessionProvider>
          <AuthModalProvider>
            <main className="flex-1 w-full overflow-x-hidden">{children}</main>
            <AuthModal />
          </AuthModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
