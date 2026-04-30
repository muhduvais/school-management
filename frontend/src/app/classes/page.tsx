"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import ClassForm from "@/components/ClassForm";
import useRole from "@/hooks/useRole";

export default function ClassesPage() {
  useAuth();

  const role = useRole();

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      alert("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
    } catch {
      alert("Failed to delete class");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Classes</h1>

      {/* Form */}
      {role === 'admin' && <div className="mb-6">
        <ClassForm onSuccess={fetchClasses} />
      </div>}

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading classes...</p>}

      {/* List */}
      <div className="space-y-4">
        {classes.map((c) => (
          <div
            key={c._id}
            className="border rounded p-4 shadow-sm bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{c.name}</h2>

              {role === 'admin' && <button
                onClick={() => handleDelete(c._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>}
            </div>

            {/* Teacher */}
            <p className="text-sm text-gray-600 mt-2">
              <strong>Teacher:</strong> {c.teacher?.name || "N/A"}
            </p>

            {/* Students */}
            <div className="mt-2">
              <p className="text-sm font-semibold mb-1">Students:</p>

              {c.students?.length === 0 ? (
                <p className="text-sm text-gray-500">No students assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {c.students.map((s: any) => (
                    <span
                      key={s._id}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}