"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-slate-50 min-h-screen text-slate-900 antialiased">
        {showNavbar && <Navbar />}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}