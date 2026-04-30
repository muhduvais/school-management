"use client";

import useStudents from "@/hooks/useStudents";
import StudentForm from "@/components/StudentForm";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import { useState } from "react";

export default function StudentsPage() {
  useAuth();

  const { students, loading, error, refetch } = useStudents();

  const [summary, setSummary] = useState<Record<string, any>>({});
  const [loadingSummary, setLoadingSummary] = useState<Record<string, boolean>>(
    {},
  );

  // 🔹 Fetch summary
  const fetchSummary = async (studentId: string) => {
    if (summary[studentId]) return;
    try {
      setLoadingSummary((p) => ({ ...p, [studentId]: true }));

      const res = await api.get(`/payments/summary/${studentId}`);

      setSummary((p) => ({
        ...p,
        [studentId]: res.data.data,
      }));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to load summary");
    } finally {
      setLoadingSummary((p) => ({ ...p, [studentId]: false }));
    }
  };

  // 🔹 Delete student
  const handleDelete = async (id: string) => {
    await api.delete(`/students/${id}`);
    refetch();
  };

  // 🔹 Pay (partial/full)
  const payAmount = async (studentId: string) => {
    const amount = prompt("Enter amount to pay");

    if (!amount) return;

    try {
      await api.post("/payments", {
        studentId,
        amount: Number(amount),
      });

      await fetchSummary(studentId);
    } catch {
      alert("Payment failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="mb-4 text-xl">Students</h1>

      <StudentForm onSuccess={refetch} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {students.map((s) => (
        <div key={s._id} className="border p-4 mb-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <span>
              {s.name} ({s.rollNumber})
            </span>

            <div className="flex gap-2">
              <button onClick={() => fetchSummary(s._id)}>
                {loadingSummary[s._id] ? "Loading..." : "View Fees"}
              </button>

              <button onClick={() => payAmount(s._id)}>Pay</button>

              <button onClick={() => handleDelete(s._id)}>Delete</button>
            </div>
          </div>

          {/* Summary */}
          {summary[s._id] && (
            <div className="mt-3 text-sm">
              <p>Total: ₹{summary[s._id].totalFees}</p>
              <p>Paid: ₹{summary[s._id].paidAmount}</p>
              <p>Pending: ₹{summary[s._id].pendingAmount}</p>

              {/* Payment history */}
              <div className="mt-2">
                <p className="font-semibold">Payments:</p>

                {summary[s._id].payments.length === 0 && <p>No payments yet</p>}

                {summary[s._id].payments.map((p: any) => (
                  <div key={p._id}>
                    ₹{p.amount} - {new Date(p.paidAt).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
