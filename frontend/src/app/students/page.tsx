'use client';

import useStudents from '@/hooks/useStudents';
import StudentForm from '@/components/StudentForm';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/api';

export default function StudentsPage() {
  useAuth();

  const { students, loading, error, refetch } = useStudents();

  const handleDelete = async (id: string) => {
    await api.delete(`/students/${id}`);
    refetch();
  };

  return (
    <div className="p-10">
      <h1 className="mb-4 text-xl">Students</h1>

      <StudentForm onSuccess={refetch} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {students.map((s) => (
        <div key={s._id} className="flex justify-between border p-2 mb-2">
          <span>{s.name} ({s.rollNumber})</span>
          <button onClick={() => handleDelete(s._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}