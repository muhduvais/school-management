"use client";

import useStudents from "@/hooks/useStudents";
import StudentForm from "@/components/StudentForm";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import { useState } from "react";
import useRole from "@/hooks/useRole";

export default function StudentsPage() {
  useAuth();

  const { students, loading, error, refetch } = useStudents();
  const role = useRole();

  const [summary, setSummary] = useState<Record<string, any>>({});
  const [loadingSummary, setLoadingSummary] = useState<Record<string, boolean>>({});

  // 🔹 Fetch fee summary
  const fetchSummary = async (studentId: string) => {
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
    try {
      await api.delete(`/students/${id}`);
      refetch();
    } catch {
      alert("Failed to delete student");
    }
  };

  // 🔹 Pay amount (partial/full)
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Students</h1>

      {/* Form */}
      {role === 'admin' && <div className="mb-6">
        <StudentForm onSuccess={refetch} />
      </div>}

      {/* States */}
      {loading && <p className="text-gray-500">Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Student List */}
      <div className="space-y-4">
        {students.map((s) => (
          <div
            key={s._id}
            className="border rounded p-4 shadow-sm bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {s.name} ({s.rollNumber})
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => fetchSummary(s._id)}
                >
                  {loadingSummary[s._id] ? "Loading..." : "View Fees"}
                </button>

                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => payAmount(s._id)}
                >
                  Pay
                </button>

                {role === 'admin' && <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(s._id)}
                >
                  Delete
                </button>}
              </div>
            </div>

            {/* Summary Section */}
            {summary[s._id] && (
              <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                <p>
                  <strong>Total:</strong> ₹{summary[s._id].totalFees}
                </p>
                <p>
                  <strong>Paid:</strong> ₹{summary[s._id].paidAmount}
                </p>
                <p>
                  <strong>Pending:</strong> ₹{summary[s._id].pendingAmount}
                </p>

                {/* Payment History */}
                <div className="mt-3">
                  <p className="font-semibold mb-1">Payments</p>

                  {summary[s._id].payments.length === 0 ? (
                    <p className="text-gray-500">No payments yet</p>
                  ) : (
                    <div className="space-y-1">
                      {summary[s._id].payments.map((p: any) => (
                        <div key={p._id} className="flex justify-between">
                          <span>₹{p.amount}</span>
                          <span className="text-gray-500">
                            {new Date(p.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}