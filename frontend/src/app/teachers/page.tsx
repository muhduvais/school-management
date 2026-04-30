"use client";

import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import TeacherForm from "@/components/TeacherForm";
import useRole from "@/hooks/useRole";

export default function TeachersPage() {
  useAuth();

  const role = useRole();

  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teachers");
      setTeachers(res.data.data || res.data);
    } catch {
      alert("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch {
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Teachers</h1>

      {/* Form */}
      {role === 'admin' && <div className="mb-6">
        <TeacherForm onSuccess={fetchTeachers} />
      </div>}

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading teachers...</p>}

      {/* List */}
      <div className="space-y-4">
        {teachers.map((t) => (
          <div
            key={t._id}
            className="border rounded p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-gray-500">{t.email}</p>
            </div>

            {role === 'admin' && <button
              onClick={() => handleDelete(t._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
}