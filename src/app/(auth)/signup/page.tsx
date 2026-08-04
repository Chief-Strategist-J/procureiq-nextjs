'use client';

import React from 'react';
import { SignupForm } from '@/features/auth';

export default function SignupPage() {
  const handleSignup = (data: { email: string; name: string }) => {
    alert(`Account created for ${data.name} (${data.email})`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
}
