"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function StudentForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !rollNumber.trim() || !age) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/students", {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        age: Number(age),
      });
      setName("");
      setRollNumber("");
      setAge("");
      setExpanded(false);
      onSuccess();
    } catch {
      alert("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setRollNumber("");
    setAge("");
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
        Add Student
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Add New Student</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fill in the student details below</p>
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

      {/* Fields */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Name */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-colors"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Roll Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-colors font-mono"
              placeholder="e.g. 2024-001"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-colors"
              placeholder="e.g. 15"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
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
          className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Add Student
            </>
          )}
        </button>
      </div>
    </div>
  );
}