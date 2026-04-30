'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import useAuth from '@/hooks/useAuth';

export default function StudentsPage() {
  useAuth();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      const res = await api.get('/students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-10">
      <h1>Students</h1>
      {students.map((s: any) => (
        <div key={s._id}>{s.name}</div>
      ))}
    </div>
  );
}