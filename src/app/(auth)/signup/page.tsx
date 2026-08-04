'use client';

import React from 'react';
import { SignupForm, useAuthManagement, SignupInput } from '@/features/auth';

export default function SignupPage() {
  const { signup, isLoading, error, resetStatus } = useAuthManagement();

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
