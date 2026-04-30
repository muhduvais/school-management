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
      <body suppressHydrationWarning={true}> 
        
        {showNavbar && <Navbar />}
        
        <main className="max-w-5xl mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}