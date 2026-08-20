'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm, useAuthManagement, SignupInput, AUTH_STATUS } from '@/features/auth';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, status, isLoading, error, resetStatus } = useAuthManagement();

  useEffect(() => {
    if (isAuthenticated || status === AUTH_STATUS.SUCCEEDED) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, status, router]);

  const handleSignup = (data: SignupInput) => {
    signup(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignupForm
        onSubmit={handleSignup}
        isLoading={isLoading}
        errorMessage={error || undefined}
        onClearError={resetStatus}
      />
    </div>
  );
}
