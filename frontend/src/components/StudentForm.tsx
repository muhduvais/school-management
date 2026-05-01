"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name should contain only letters"),

  rollNumber: z
    .string()
    .min(1, "Roll number is required")
    .regex(/^[A-Za-z0-9]+$/, "No special characters allowed"),

  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => Number(val) > 0, "Age must be valid"),
});

type FormData = z.infer<typeof schema>;

export default function StudentForm({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void;
  initialData?: any;
}) {
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
        rollNumber: initialData.rollNumber,
        age: String(initialData.age),
      });
      setExpanded(true);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (initialData) {
        await api.patch(`/students/${initialData._id}`, {
          name: data.name.trim(),
          rollNumber: data.rollNumber.trim(),
          age: Number(data.age),
        });
      } else {
        await api.post("/students", {
          name: data.name.trim(),
          rollNumber: data.rollNumber.trim(),
          age: Number(data.age),
        });
      }

      reset();
      setExpanded(false);
      onSuccess();
    } catch {
      alert("Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setExpanded(false);
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
        <h2>{initialData ? "Edit Student" : "Add New Student"}</h2>
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Add New Student
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the student details below
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 transition-colors
                  ${
                    errors.name
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white"
                  }
                `}
                placeholder="e.g. Arjun Sharma"
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Roll Number <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                {...register("rollNumber")}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 font-mono transition-colors
                  ${
                    errors.rollNumber
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white"
                  }
                `}
                placeholder="e.g. 2024-001"
              />

              {errors.rollNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.rollNumber.message}
                </p>
              )}
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
                {...register("age")}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 transition-colors
                  ${
                    errors.age
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white"
                  }
                `}
                placeholder="e.g. 15"
              />

              {errors.age && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60"
          >
            {loading
              ? initialData
                ? "Updating..."
                : "Adding..."
              : initialData
                ? "Update Student"
                : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
