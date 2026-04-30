'use client';

import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import useClasses from '@/hooks/useClasses';
import api from '@/lib/api';

export default function AttendancePage() {
  useAuth();

  const { classes } = useClasses();

  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load students from selected class
  const loadStudents = () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const cls: any = classes.find((c: any) => c._id === selectedClass);
    setStudents(cls?.students || []);
  };

  // Mark attendance
  const markAttendance = async () => {
    if (!selectedClass || !date) {
      alert('Please select class and date');
      return;
    }

    try {
      setLoading(true);

      const existing = await api.get(
        `/attendance?classId=${selectedClass}&date=${date}`
      );

      if (existing.data.length > 0) {
        alert('Attendance already marked for this class on this date');
        return;
      }

      await Promise.all(
        students.map((s) =>
          api.post('/attendance', {
            student: s._id,
            class: selectedClass,
            date,
            status: attendance[s._id] || 'present',
          })
        )
      );

      alert('Attendance marked successfully');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Attendance</h1>

      {/* Select class */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border p-2"
      >
        <option value="">Select Class</option>
        {classes.map((c: any) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 ml-2"
      />

      <button onClick={loadStudents} className="ml-2 border px-3 py-1">
        Load Students
      </button>

      {/* Students */}
      <div className="mt-4">
        {students.map((s) => (
          <div key={s._id} className="flex gap-2 mb-2">
            <span>{s.name}</span>
            <select
              className="border"
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

      <button
        className="mt-4 border px-4 py-2"
        onClick={markAttendance}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Attendance'}
      </button>
    </div>
  );
}