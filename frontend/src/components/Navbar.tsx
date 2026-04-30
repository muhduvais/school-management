'use client';

import Link from 'next/link';
import { logout } from '@/lib/auth';

export default function Navbar() {
  return (
    <div className="p-4 bg-gray-200 flex gap-4">
      <Link href="/login">Login</Link>
      <Link href="/students">Students</Link>
      <Link href="/teachers">Teachers</Link>
      <Link href="/classes">Classes</Link>

      <button onClick={logout}>Logout</button>
    </div>
  );
}