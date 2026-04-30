'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function useClassFormData() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const t = await api.get('/teachers');
      const s = await api.get('/students');

      setTeachers(t.data.data);
      setStudents(s.data.data);
    };

    fetch();
  }, []);

  return { teachers, students };
}