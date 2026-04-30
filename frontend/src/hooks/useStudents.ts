'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Student } from '@/types/student';

export default function useStudents(page = 1, limit = 5) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students?page=${page}&limit=${limit}`);
      setStudents(res.data.data);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  return { students, loading, error, refetch: fetchStudents };
}