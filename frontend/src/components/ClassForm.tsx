'use client';

import { useState } from 'react';
import api from '@/lib/api';
import useClassFormData from '@/hooks/useClassFormData';

export default function ClassForm({ onSuccess }: { onSuccess: () => void }) {
  const { teachers, students } = useClassFormData();

  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleStudentSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await api.post('/classes', {
        name,
        teacher,
        students: selectedStudents,
      });

      setName('');
      setTeacher('');
      setSelectedStudents([]);
      onSuccess();
    } catch {
      alert('Failed to create class');
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-2">
      <input
        placeholder="Class Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Teacher dropdown */}
      <select onChange={(e) => setTeacher(e.target.value)} value={teacher}>
        <option value="">Select Teacher</option>
        {teachers.map((t: any) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Students multi-select */}
      <div className="flex flex-wrap gap-2">
        {students.map((s: any) => (
          <button
            key={s._id}
            onClick={() => handleStudentSelect(s._id)}
            className={`border px-2 ${
              selectedStudents.includes(s._id) ? 'bg-blue-300' : ''
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <button onClick={handleSubmit}>Create Class</button>
    </div>
  );
}