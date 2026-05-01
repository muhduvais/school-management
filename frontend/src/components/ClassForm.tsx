"use client";

import { useState } from "react";
import api from "@/lib/api";
import useClassFormData from "@/hooks/useClassFormData";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .regex(/^[A-Za-z0-9]+$/, "No special characters allowed"),

  teacher: z
    .string()
    .min(1, "Teacher is required"),
});

type FormData = z.infer<typeof schema>;

export default function ClassForm({ onSuccess }: { onSuccess: () => void }) {
  const { teachers, students } = useClassFormData();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleStudentSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      await api.post("/classes", {
        name: data.name.trim(),
        teacher: data.teacher,
        students: selectedStudents,
      });

      reset();
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
    reset();
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
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Create New Class</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to add a class</p>
        </div>
        <button
          onClick={handleCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="px-5 py-5 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Class name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Class Name <span className="text-red-400">*</span>
              </label>

              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                         transition-colors"
                placeholder="e.g. Grade 10-A"
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Assign Teacher <span className="text-red-400">*</span>
              </label>

              <select
                {...register("teacher")}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white
                         transition-colors appearance-none cursor-pointer"
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

              {errors.teacher && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.teacher.message}
                </p>
              )}
            </div>

          </div>

          {/* Students */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-700">
                Enroll Students
              </label>

              {selectedStudents.length > 0 && (
                <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                  {selectedStudents.length} selected
                </span>
              )}
            </div>

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
                    {s.name}
                  </button>
                );
              })}
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
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {loading ? "Creating…" : "Create Class"}
          </button>
        </div>

      </form>
    </div>
  );
}