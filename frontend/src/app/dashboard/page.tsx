"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const statCards = [
  {
    key: "students",
    label: "Students",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    color: "bg-indigo-50 text-indigo-600",
    href: "/students",
  },
  {
    key: "teachers",
    label: "Teachers",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: "bg-violet-50 text-violet-600",
    href: "/teachers",
  },
  {
    key: "classes",
    label: "Classes",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    color: "bg-sky-50 text-sky-600",
    href: "/classes",
  },
];

const quickLinks = [
  {
    href: "/students",
    label: "Students",
    description: "Enroll & manage student records",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    accent: "group-hover:bg-indigo-50 group-hover:border-indigo-200",
    iconAccent: "group-hover:bg-indigo-100 group-hover:text-indigo-600",
  },
  {
    href: "/teachers",
    label: "Teachers",
    description: "View & manage teaching staff",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    accent: "group-hover:bg-violet-50 group-hover:border-violet-200",
    iconAccent: "group-hover:bg-violet-100 group-hover:text-violet-600",
  },
  {
    href: "/classes",
    label: "Classes",
    description: "Organise classes & assignments",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    accent: "group-hover:bg-sky-50 group-hover:border-sky-200",
    iconAccent: "group-hover:bg-sky-100 group-hover:text-sky-600",
  },
  {
    href: "/attendance",
    label: "Attendance",
    description: "Track & review daily attendance",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
    accent: "group-hover:bg-emerald-50 group-hover:border-emerald-200",
    iconAccent: "group-hover:bg-emerald-100 group-hover:text-emerald-600",
  },
];

export default function DashboardPage() {
  useAuth();

  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes] = await Promise.all([
          api.get("/students"),
          api.get("/teachers"),
          api.get("/classes"),
        ]);
        setStats({
          students: students.data.total ?? students.data.data?.length ?? students.data.length ?? 0,
          teachers: teachers.data.total ?? teachers.data.data?.length ?? teachers.data.length ?? 0,
          classes: classes.data.length ?? 0,
        });
      } catch {
        console.log("Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's an overview of your school today.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">System online</span>
        </div>
      </div>

      {/* Stat cards */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map(({ key, label, icon, color, href }) => (
            <Link
              key={key}
              href={href}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} transition-colors`}>
                  {icon}
                </div>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              {loadingStats ? (
                <div className="h-8 w-12 bg-slate-200 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stats[key as keyof typeof stats]}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ href, label, description, icon, accent, iconAccent }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:shadow-sm transition-all ${accent}`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500 shrink-0 transition-all ${iconAccent}`}
              >
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 truncate">{description}</p>
              </div>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}