"use client";

import { useState } from "react";
import api from "@/lib/api";
import useClassFormData from "@/hooks/useClassFormData";

export default function ClassForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { teachers, students } = useClassFormData();

  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle student selection
  const handleStudentSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name || !teacher) {
      alert("Class name and teacher are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/classes", {
        name,
        teacher,
        students: selectedStudents,
      });

      setName("");
      setTeacher("");
      setSelectedStudents([]);

      onSuccess();
    } catch {
      alert("Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Create Class</h2>

      {/* Class name */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Class Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Teacher dropdown */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
      >
        <option value="">Select Teacher</option>
        {teachers.map((t: any) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Students multi-select */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Select Students</p>

        <div className="flex flex-wrap gap-2">
          {students.map((s: any) => {
            const selected = selectedStudents.includes(s._id);

            return (
              <button
                key={s._id}
                type="button"
                onClick={() => handleStudentSelect(s._id)}
                className={`px-2 py-1 rounded text-sm border ${
                  selected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Creating..." : "Create Class"}
      </button>
    </div>
  );
}