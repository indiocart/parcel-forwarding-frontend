'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import api from '@/services/api';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const response = await api.get('/users/profile');
        if (response.data.user?.isAdmin) {
          setIsAdmin(true);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}