"use client";

import useAuth from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import TeacherForm from "@/components/TeacherForm";
import useRole from "@/hooks/useRole";
import DeleteConfirmModal from "@/components/ConfirmDelete";

export default function TeachersPage() {
  useAuth();

  const role = useRole();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const totalPages = Math.ceil(total / limit);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/teachers?page=${page}&limit=${limit}`);

      const { data, total } = res.data;

      setTeachers(data);
      setTotal(total);
    } catch {
      alert("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
  };

  const confirmDelete = async () => {
    if (!selectedTeacher) return;
    try {
      setIsDeleting(true);
      await api.delete(`/teachers/${selectedTeacher._id}`);
      setDeleteModal(false);
      fetchTeachers();
    } catch {
      alert("Failed to delete teacher");
    } finally {
      setIsDeleting(false);
      setSelectedTeacher(null);
    }
  };

  const openDeleteModal = (teacher: any) => {
    setSelectedTeacher(teacher);
    setDeleteModal(true);
  };

  // Initials from name
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // Deterministic avatar colour per teacher
  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-teal-100 text-teal-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const avatarColor = (name: string) =>
    avatarColors[
      name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
        avatarColors.length
    ];

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Teachers
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading
              ? "Loading…"
              : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} on staff`}
          </p>
        </div>
      </div>

      {/* Add form */}
      {role === "admin" && (
        <div className="mb-8">
          <TeacherForm
            onSuccess={() => {
              setEditingTeacher(null);
              fetchTeachers();
            }}
            initialData={editingTeacher}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && teachers.length === 0 && (
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
            No teachers on staff yet
          </p>
          {role === "admin" && (
            <p className="text-slate-400 text-xs mt-1">
              Use the form above to add your first teacher.
            </p>
          )}
        </div>
      )}

      {/* Teacher grid */}
      {!loading && teachers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <div
              key={t._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              {/* Top: avatar + name + email */}
              <div className="flex items-start gap-3">
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-semibold shrink-0 ${avatarColor(t.name)}`}
                >
                  {getInitials(t.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {t.email}
                  </p>
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {t.subject && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    {t.subject}
                  </span>
                )}
                {t.experience !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    {t.experience} yr{t.experience !== 1 ? "s" : ""} exp.
                  </span>
                )}
              </div>

              {/* Delete — admin only, pushed to bottom */}
              {role === "admin" && (
                <div className="pt-1 border-t border-slate-100 mt-auto">
                  <div className="flex gap-2 w-full">
                    {/* EDIT */}
                    <button
                      onClick={() => handleEdit(t)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer flex-1 sm:flex-none"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => openDeleteModal(t)}
                      disabled={deletingId === t._id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-1 sm:flex-none"
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

                      {deletingId === t._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
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
        itemName={selectedTeacher?.name}
        title="Delete Teacher"
        description="Removing this teacher will remove them from all assigned classes."
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedTeacher(null);
        }}
      />
    </div>
  );
}
