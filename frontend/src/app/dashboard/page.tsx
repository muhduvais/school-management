"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

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
          api.get("/students"),
          api.get("/teachers"),
          api.get("/classes"),
        ]);

        setStats({
          students: students.data.total || students.data.data.length,
          teachers: teachers.data.total || teachers.data.data.length,
          classes: classes.data.length,
        });
      } catch {
        console.log("Failed to load stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded p-4 shadow-sm bg-white">
          <p className="text-gray-500 text-sm">Students</p>
          <p className="text-xl font-semibold">{stats.students}</p>
        </div>

        <div className="border rounded p-4 shadow-sm bg-white">
          <p className="text-gray-500 text-sm">Teachers</p>
          <p className="text-xl font-semibold">{stats.teachers}</p>
        </div>

        <div className="border rounded p-4 shadow-sm bg-white">
          <p className="text-gray-500 text-sm">Classes</p>
          <p className="text-xl font-semibold">{stats.classes}</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="border rounded p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/students"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Students
          </Link>

          <Link
            href="/teachers"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Teachers
          </Link>

          <Link
            href="/classes"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Classes
          </Link>

          <Link
            href="/attendance"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}