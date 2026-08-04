'use client';

import React from 'react';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  const handleLogin = (data: { email: string }) => {
    alert(`Logged in with email: ${data.email}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
