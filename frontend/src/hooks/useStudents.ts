import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export default function useStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 5;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/students?page=${page}&limit=${limit}`);

      const { data, total } = res.data;

      setStudents(data);
      setTotal(total);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalPages = Math.ceil(total / limit);

  const safeSetPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    page,
    setPage: safeSetPage,
    total,
    totalPages,
    limit,
  };
}