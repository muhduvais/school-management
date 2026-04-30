'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push('/login');
    }
  }, []);
}