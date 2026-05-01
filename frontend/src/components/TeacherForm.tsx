"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-colors";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters allowed"),

  email: z.string().trim().min(1, "Email is required").email("Invalid email"),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters allowed"),

  experience: z
    .string()
    .min(1, "Experience is required")
    .refine((val) => Number(val) >= 0, "Must be valid"),

  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function TeacherForm({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void;
  initialData?: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        subject: initialData.subject,
        experience: String(initialData.experience),
        password: "",
      });
      setExpanded(true);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (initialData) {
        await api.patch(`/teachers/${initialData._id}`, {
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject.trim(),
          experience: Number(data.experience),
        });
      } else {
        await api.post("/teachers", {
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject.trim(),
          experience: Number(data.experience),
          password: data.password,
        });
      }

      reset();
      setExpanded(false);
      onSuccess();
    } catch {
      alert("Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setExpanded(false);
    setShowPassword(false);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Teacher
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Add New Teacher
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the teacher's details and login credentials
          </p>
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
          {/* Personal Info */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Personal Info
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("name")}
                  className={inputClass}
                  placeholder="e.g. Priya Nair"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  placeholder="e.g. priya@school.edu"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Professional Info
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("subject")}
                  className={inputClass}
                  placeholder="e.g. Mathematics"
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  {...register("experience")}
                  className={inputClass}
                  placeholder="e.g. 5"
                />
                {errors.experience && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Login Credentials
            </p>

            <div className="sm:max-w-sm">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`${inputClass} pr-10`}
                  placeholder="Set a secure password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}

              <p className="text-xs text-slate-400 mt-1.5">
                The teacher will use this to log in to the portal.
              </p>
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
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {initialData ? "Updating…" : "Adding…"}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
                {initialData ? "Update Teacher" : "Add Teacher"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
