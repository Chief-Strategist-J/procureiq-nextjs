'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, useAuthManagement, LoginInput } from '@/features/auth';

export default function HomePage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, resetStatus } = useAuthManagement();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        errorMessage={error || undefined}
        onClearError={resetStatus}
      />
    </div>
  );
}
