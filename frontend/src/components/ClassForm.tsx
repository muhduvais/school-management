"use client";

import { useState } from "react";
import api from "@/lib/api";
import useClassFormData from "@/hooks/useClassFormData";

export default function ClassForm({ onSuccess }: { onSuccess: () => void }) {
  const { teachers, students } = useClassFormData();

  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleStudentSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !teacher) {
      alert("Class name and teacher are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/classes", {
        name: name.trim(),
        teacher,
        students: selectedStudents,
      });
      setName("");
      setTeacher("");
      setSelectedStudents([]);
      setExpanded(false);
      onSuccess();
    } catch {
      alert("Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setTeacher("");
    setSelectedStudents([]);
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Class
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Create New Class</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to add a class</p>
        </div>
        <button
          onClick={handleCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Row 1: name + teacher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Class name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Class Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                         transition-colors"
              placeholder="e.g. Grade 10-A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Teacher dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Assign Teacher <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                         transition-colors appearance-none cursor-pointer"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                backgroundSize: "16px",
                paddingRight: "36px",
              }}
            >
              <option value="">Select a teacher…</option>
              {teachers.map((t: any) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students multi-select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-slate-700">
              Enroll Students
              <span className="ml-1.5 text-slate-400 font-normal">(optional)</span>
            </label>
            {selectedStudents.length > 0 && (
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedStudents.length} selected
              </span>
            )}
          </div>

          {students.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-3">No students available</p>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 max-h-36 overflow-y-auto">
              {students.map((s: any) => {
                const selected = selectedStudents.includes(s._id);
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleStudentSelect(s._id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      selected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {selected && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating…
            </>
          ) : (
            "Create Class"
          )}
        </button>
      </div>
    </div>
  );
}