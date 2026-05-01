"use client";

import useStudents from "@/hooks/useStudents";
import StudentForm from "@/components/StudentForm";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import DeleteConfirmModal from "@/components/ConfirmDelete";

export default function StudentsPage() {
  useAuth();

  const { students, totalPages, page, setPage, loading, error, refetch } =
    useStudents();
  const role = useRole();

  const [summary, setSummary] = useState<Record<string, any>>({});
  const [loadingSummary, setLoadingSummary] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount_input, setPayAmountInput] = useState<Record<string, string>>(
    {},
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const fetchSummary = async (studentId: string) => {
    try {
      setLoadingSummary((p) => ({ ...p, [studentId]: true }));
      const res = await api.get(`/payments/summary/${studentId}`);
      setSummary((p) => ({ ...p, [studentId]: res.data.data }));
      setExpandedId(studentId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load summary");
    } finally {
      setLoadingSummary((p) => ({ ...p, [studentId]: false }));
    }
  };

  const toggleSummary = (studentId: string) => {
    if (expandedId === studentId) {
      setExpandedId(null);
    } else if (summary[studentId]) {
      setExpandedId(studentId);
    } else {
      fetchSummary(studentId);
    }
  };

  const confirmDelete = async () => {
  if (!selectedStudent) return;

  try {
    setIsDeleting(true);

    await api.delete(`/students/${selectedStudent._id}`);

    if (students.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      refetch();
    }

    setDeleteModal(false);
  } catch {
    alert("Failed to delete student");
  } finally {
    setIsDeleting(false);
    setSelectedStudent(null);
  }
};

  const openDeleteModal = (student: any) => {
    setSelectedStudent(student);
    setDeleteModal(true);
  };

  const payAmount = async (studentId: string) => {
    const raw = payAmount_input[studentId];
    const amount = Number(raw);
    if (!raw || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    try {
      setPayingId(studentId);
      await api.post("/payments", { studentId, amount });
      setPayAmountInput((p) => ({ ...p, [studentId]: "" }));
      await fetchSummary(studentId);
    } catch {
      alert("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  const getProgressColor = (paid: number, total: number) => {
    if (total === 0) return "bg-slate-200";
    const pct = (paid / total) * 100;
    if (pct >= 100) return "bg-emerald-500";
    if (pct >= 60) return "bg-amber-400";
    return "bg-red-400";
  };

  const getStatusBadge = (paid: number, total: number) => {
    if (total === 0) return null;
    const pct = (paid / total) * 100;
    if (pct >= 100)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Paid
        </span>
      );
    if (pct > 0)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Partial
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        Unpaid
      </span>
    );
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Students
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading
              ? "Loading…"
              : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>
      </div>

      {/* Add form */}
      {role === "admin" && (
        <div className="mb-8">
          <StudentForm onSuccess={refetch} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          {error}
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div>
                    <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                  <div className="h-8 w-16 bg-slate-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && students.length === 0 && !error && (
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            No students enrolled yet
          </p>
          {role === "admin" && (
            <p className="text-slate-400 text-xs mt-1">
              Use the form above to add your first student.
            </p>
          )}
        </div>
      )}

      {/* Student cards */}
      {!loading && students.length > 0 && (
        <div className="space-y-3">
          {students.map((s) => {
            const sum = summary[s._id];
            const isExpanded = expandedId === s._id;
            const paidPct = sum
              ? Math.min(
                  100,
                  Math.round((sum.paidAmount / sum.totalFees) * 100),
                )
              : 0;

            return (
              <div
                key={s._id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Card header */}
                <div className="px-5 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm shrink-0 border border-indigo-100">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 text-sm">
                            {s.name}
                          </p>
                          <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            #{s.rollNumber}
                          </span>
                          {sum && getStatusBadge(sum.paidAmount, sum.totalFees)}
                        </div>
                        {s.age && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Age {s.age}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => toggleSummary(s._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        {loadingSummary[s._id] ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 animate-spin"
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
                            Loading…
                          </>
                        ) : (
                          <>
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
                                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
                              />
                            </svg>
                            {isExpanded ? "Hide Fees" : "View Fees"}
                          </>
                        )}
                      </button>

                      {role === "admin" && (
                        <button
                          onClick={() => openDeleteModal(s)}
                          disabled={deletingId === s._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                          {deletingId === s._id ? "Deleting…" : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee summary panel */}
                {isExpanded && sum && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    {/* Fee metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        {
                          label: "Total Fees",
                          value: sum.totalFees,
                          color: "text-slate-700",
                        },
                        {
                          label: "Paid",
                          value: sum.paidAmount,
                          color: "text-emerald-700",
                        },
                        {
                          label: "Pending",
                          value: sum.pendingAmount,
                          color:
                            sum.pendingAmount > 0
                              ? "text-red-600"
                              : "text-slate-400",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          className="bg-white border border-slate-100 rounded-lg p-3"
                        >
                          <p className="text-xs text-slate-500 mb-1">{label}</p>
                          <p className={`text-base font-semibold ${color}`}>
                            ₹{value.toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    {sum.totalFees > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                          <span>Payment progress</span>
                          <span className="font-medium">{paidPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getProgressColor(sum.paidAmount, sum.totalFees)}`}
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Pay input */}
                    {sum.pendingAmount > 0 && (
                      <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={sum.pendingAmount}
                            placeholder={`Amount (max ₹${sum.pendingAmount.toLocaleString("en-IN")})`}
                            value={payAmount_input[s._id] || ""}
                            onChange={(e) =>
                              setPayAmountInput((p) => ({
                                ...p,
                                [s._id]: e.target.value,
                              }))
                            }
                            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                          />
                        </div>
                        <button
                          onClick={() => payAmount(s._id)}
                          disabled={payingId === s._id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-sm"
                        >
                          {payingId === s._id ? (
                            <>
                              <svg
                                className="w-3.5 h-3.5 animate-spin"
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
                              Paying…
                            </>
                          ) : (
                            <>
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
                                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                />
                              </svg>
                              Pay
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Payment history */}
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                        Payment History
                      </p>
                      {sum.payments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">
                          No payments recorded yet
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {sum.payments.map((p: any, idx: number) => (
                            <div
                              key={p._id}
                              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white border border-slate-100 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                  {sum.payments.length - idx}
                                </span>
                                <span className="font-medium text-slate-800">
                                  ₹{Number(p.amount).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {new Date(p.paidAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModal}
        itemName={selectedStudent?.name}
        title="Delete Student"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
