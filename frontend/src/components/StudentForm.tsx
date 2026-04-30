'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function StudentForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/students', {
        name,
        rollNumber,
        age: Number(age),
      });

      setName('');
      setRollNumber('');
      setAge('');
      onSuccess();
    } catch {
      alert('Failed to create student');
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Roll" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
      <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}