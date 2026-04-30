"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useClasses from "@/hooks/useClasses";
import api from "@/lib/api";

export default function AttendancePage() {
  useAuth();

  const { classes } = useClasses();

  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load students of selected class
  const loadStudents = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const cls: any = classes.find((c: any) => c._id === selectedClass);
    setStudents(cls?.students || []);
  };

  // Submit attendance
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

      alert("Attendance marked successfully");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Attendance</h1>

      {/* Controls */}
      <div className="border rounded p-4 shadow-sm bg-white mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="border p-2 rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={loadStudents}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Students
          </button>
        </div>
      </div>

      {/* Students */}
      <div className="space-y-3">
        {students.map((s) => (
          <div
            key={s._id}
            className="border rounded p-3 bg-white flex justify-between items-center"
          >
            <span className="font-medium">{s.name}</span>

            <select
              className="border p-1 rounded"
              value={attendance[s._id] || "present"}
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  [s._id]: e.target.value,
                }))
              }
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        ))}
      </div>

      {/* Submit */}
      {students.length > 0 && (
        <button
          onClick={markAttendance}
          disabled={loading}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
      )}
    </div>
  );
}