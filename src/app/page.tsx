'use client';

import React from 'react';
import { LoginForm } from '@/features/auth';

export default function HomePage() {
  const handleLoginSuccess = (data: { email: string }) => {
    console.log(`[AUTH SUCCESS] User logged in: ${data.email}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm onSubmit={handleLoginSuccess} />
    </div>
  );
}
