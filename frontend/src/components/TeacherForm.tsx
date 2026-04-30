'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function TeacherForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/teachers', { name, subject, email });

      setName('');
      setSubject('');
      setEmail('');
      onSuccess();
    } catch {
      alert('Failed to create teacher');
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}