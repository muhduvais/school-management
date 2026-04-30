'use client';

import useAuth from '@/hooks/useAuth';
import useTeachers from '@/hooks/useTeachers';
import TeacherForm from '@/components/TeacherForm';
import api from '@/lib/api';

export default function TeachersPage() {
  useAuth();

  const { teachers, loading, refetch } = useTeachers();

  const handleDelete = async (id: string) => {
    await api.delete(`/teachers/${id}`);
    refetch();
  };

  return (
    <div className="p-10">
      <h1 className="mb-4 text-xl">Teachers</h1>

      <TeacherForm onSuccess={refetch} />

      {loading && <p>Loading...</p>}

      {teachers.map((t) => (
        <div key={t._id} className="flex justify-between border p-2 mb-2">
          <span>{t.name} ({t.subject})</span>
          <button onClick={() => handleDelete(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}