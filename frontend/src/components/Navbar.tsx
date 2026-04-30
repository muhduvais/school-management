"use client";

import { logout } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-gray-100 mb-6 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left */}
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-blue-500">
            Dashboard
          </Link>

          <Link href="/students" className="hover:text-blue-500">
            Students
          </Link>

          <Link href="/teachers" className="hover:text-blue-500">
            Teachers
          </Link>

          <Link href="/classes" className="hover:text-blue-500">
            Classes
          </Link>

          <Link href="/attendance" className="hover:text-blue-500">
            Attendance
          </Link>
        </div>

        {/* Right */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}