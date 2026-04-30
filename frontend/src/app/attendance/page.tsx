"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useClasses from "@/hooks/useClasses";
import api from "@/lib/api";

export default function AttendancePage() {
  useAuth();

  const { classes } = useClasses();

  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadStudents = () => {
    if (!selectedClass) return;
    const cls: any = classes.find((c: any) => c._id === selectedClass);
    const list = cls?.students || [];
    setStudents(list);
    setStudentsLoaded(true);
    setSubmitSuccess(false);
    // Default everyone to present
    const defaults: Record<string, string> = {};
    list.forEach((s: any) => { defaults[s._id] = "present"; });
    setAttendance(defaults);
  };

  const fetchHistory = async (classId: string) => {
    if (!classId) return;
    try {
      const res = await api.get(`/attendance/class/${classId}`);
      setHistory(res.data);
    } catch {
      alert("Failed to load attendance history");
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setStudents([]);
    setAttendance({});
    setStudentsLoaded(false);
    setSubmitSuccess(false);
    fetchHistory(classId);
  };

  const toggleAll = (status: string) => {
    const next: Record<string, string> = {};
    students.forEach((s) => { next[s._id] = status; });
    setAttendance(next);
  };

  const markAttendance = async () => {
    if (!selectedClass || !date) {
      alert("Please select class and date");
      return;
    }
    try {
      setLoading(true);
      await Promise.all(
        students.map((s) =>
          api.post("/attendance", {
            student: s._id,
            class: selectedClass,
            date,
            status: attendance[s._id] || "present",
          })
        )
      );
      setSubmitSuccess(true);
      fetchHistory(selectedClass);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const groupedHistory = history.reduce((acc: any, item: any) => {
    const d = new Date(item.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  const presentCount = Object.values(attendance).filter((v) => v === "present").length;
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length;
  const attendancePct = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Attendance</h1>
        <p className="text-sm text-slate-500 mt-0.5">Mark and review daily attendance records</p>
      </div>

      {/* Controls panel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Mark Attendance</h2>
        </div>
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Class select */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Class</label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                           transition-colors appearance-none cursor-pointer"
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px",
                  paddingRight: "36px",
                }}
              >
                <option value="">Select a class…</option>
                {classes.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                           transition-colors"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Load button */}
            <div className="flex items-end">
              <button
                onClick={loadStudents}
                disabled={!selectedClass}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Load Students
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student attendance list */}
      {studentsLoaded && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* List header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                {students.length > 0
                  ? `${students.length} student${students.length !== 1 ? "s" : ""}`
                  : "No students"}
              </h2>
              {students.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {presentCount} present · {absentCount} absent
                </p>
              )}
            </div>

            {/* Bulk toggle */}
            {students.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Mark all:</span>
                <button
                  onClick={() => toggleAll("present")}
                  className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Present
                </button>
                <button
                  onClick={() => toggleAll("absent")}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Absent
                </button>
              </div>
            )}
          </div>

          {students.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400 italic">No students enrolled in this class.</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Attendance rate</span>
                  <span className="font-medium">{attendancePct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      attendancePct >= 75 ? "bg-emerald-500" : attendancePct >= 50 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${attendancePct}%` }}
                  />
                </div>
              </div>

              {/* Students */}
              <div className="px-5 pb-2 pt-3 space-y-2">
                {students.map((s, idx) => {
                  const status = attendance[s._id] || "present";
                  const isPresent = status === "present";
                  return (
                    <div
                      key={s._id}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                        isPresent
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-5 text-right font-mono">{idx + 1}</span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                            isPresent
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{s.name}</span>
                      </div>

                      {/* Toggle buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setAttendance((p) => ({ ...p, [s._id]: "present" }))}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            isPresent
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-500 hover:bg-slate-100 border border-slate-200 bg-white"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setAttendance((p) => ({ ...p, [s._id]: "absent" }))}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                            !isPresent
                              ? "bg-red-500 text-white shadow-sm"
                              : "text-slate-500 hover:bg-slate-100 border border-slate-200 bg-white"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit footer */}
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {submitSuccess ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Attendance submitted successfully
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Review attendance for <span className="font-medium text-slate-600">{new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span> before submitting.
                  </p>
                )}

                <button
                  onClick={markAttendance}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Submit Attendance
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Attendance history */}
      {Object.keys(groupedHistory).length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Attendance History
          </h2>
          <div className="space-y-3">
            {Object.entries(groupedHistory).map(([dateLabel, records]: any) => {
              const presentInDay = records.filter((r: any) => r.status === "present").length;
              const totalInDay = records.length;
              const pct = totalInDay > 0 ? Math.round((presentInDay / totalInDay) * 100) : 0;

              return (
                <div key={dateLabel} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {/* Day header */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-700">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          pct >= 75
                            ? "bg-emerald-50 text-emerald-700"
                            : pct >= 50
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {pct}% present
                      </span>
                      <span className="text-xs text-slate-400">{presentInDay}/{totalInDay}</span>
                    </div>
                  </div>

                  {/* Records */}
                  <div className="divide-y divide-slate-50">
                    {records.map((r: any) => (
                      <div key={r._id} className="flex items-center justify-between px-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              r.status === "present"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {r.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-700">{r.student?.name}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            r.status === "present"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {r.status === "present" ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}