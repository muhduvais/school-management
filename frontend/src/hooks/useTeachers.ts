'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Teacher } from '@/types/teacher';

export default function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teachers');
      setTeachers(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { teachers, loading, refetch: fetchTeachers };
}