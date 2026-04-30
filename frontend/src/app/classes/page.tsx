'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ClassForm from '@/components/ClassForm';
import useAuth from '@/hooks/useAuth';

export default function ClassesPage() {
  useAuth();

  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const res = await api.get('/classes');
    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Classes</h1>

      <ClassForm onSuccess={fetchClasses} />

      {classes.map((c: any) => (
        <div key={c._id} className="border p-3 mb-2">
          <h2>{c.name}</h2>
          <p>Teacher: {c.teacher?.name}</p>
          <p>
            Students: {c.students?.map((s: any) => s.name).join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
}