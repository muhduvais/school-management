"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import ClassForm from "@/components/ClassForm";
import useRole from "@/hooks/useRole";
import DeleteConfirmModal from "@/components/ConfirmDelete";

export default function ClassesPage() {
  useAuth();

  const role = useRole();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;
  const [mounted, setMounted] = useState(false);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/classes?page=${page}&limit=${limit}`);

      const { data, total } = res.data;

      setClasses(data);
      setTotal(total);
    } catch {
      alert("Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  if (!mounted) return null;

  const confirmDelete = async () => {
    if (!selectedClass) return;
    try {
      setIsDeleting(true);
      await api.delete(`/classes/${selectedClass._id}`);
      setDeleteModal(false);
      fetchClasses();
    } catch {
      alert("Failed to delete class");
    } finally {
      setIsDeleting(false);
      setSelectedClass(null);
    }
  };

  const openDeleteModal = (classObj: any) => {
    setSelectedClass(classObj);
    setDeleteModal(true);
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Classes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {classes.length > 0
              ? `${classes.length} class${classes.length === 1 ? "" : "es"} total`
              : "No classes yet"}
          </p>
        </div>
      </div>

      {/* Create form — admin only */}
      {role === "admin" && (
        <div className="mb-8">
          <ClassForm onSuccess={fetchClasses} />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-8 w-20 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-4 w-32 bg-slate-100 rounded mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
                <div className="h-6 w-14 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && classes.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            No classes assigned yet
          </p>
          {role === "admin" && (
            <p className="text-slate-400 text-xs mt-1">
              Use the form above to create your first class.
            </p>
          )}
        </div>
      )}

      {/* Class cards */}
      {!loading && classes.length > 0 && (
        <div className="space-y-4">
          {Array.isArray(classes) &&
          classes.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm shrink-0">
                    {c.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 text-base leading-tight truncate">
                      {c.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.students?.length || 0} student
                      {c.students?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {role === "admin" && (
                  <button
                    onClick={() => openDeleteModal(c)}
                    disabled={deletingId === c._id}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    {deletingId === c._id ? "Deleting…" : "Delete"}
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 my-4" />

              {/* Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Teacher */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      {c.teacher?.name || "No teacher"}
                    </span>
                    <span className="ml-1 text-slate-400">· Teacher</span>
                  </span>
                </div>

                {/* Students */}
                <div className="flex-1">
                  {c.students?.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      No students enrolled
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {c.students.map((s: any) => (
                        <span
                          key={s._id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModal}
        itemName={selectedClass?.name}
        title="Delete Class"
        description="This will permanently remove the class and unenroll all students from it."
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedClass(null);
        }}
      />
    </div>
  );
}
