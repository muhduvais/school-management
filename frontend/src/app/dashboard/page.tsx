'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  useAuth();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes] = await Promise.all([
          api.get('/students'),
          api.get('/teachers'),
          api.get('/classes'),
        ]);

        setStats({
          students: students.data.total || students.data.data.length,
          teachers: teachers.data.total || teachers.data.data.length,
          classes: classes.data.length,
        });
      } catch {
        console.log('Failed to load stats');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border p-4">
          <h2>Students</h2>
          <p className="text-xl">{stats.students}</p>
        </div>

        <div className="border p-4">
          <h2>Teachers</h2>
          <p className="text-xl">{stats.teachers}</p>
        </div>

        <div className="border p-4">
          <h2>Classes</h2>
          <p className="text-xl">{stats.classes}</p>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="flex gap-4">
        <Link href="/students" className="border px-4 py-2">
          Manage Students
        </Link>

        <Link href="/teachers" className="border px-4 py-2">
          Manage Teachers
        </Link>

        <Link href="/classes" className="border px-4 py-2">
          Manage Classes
        </Link>

        <Link href="/attendance" className="border px-4 py-2">
          Attendance
        </Link>
      </div>
    </div>
  );
}