'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/features/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('');

  const handleSubmit = (data: { email: string }) => {
    setMsg(`Password reset instructions have been sent to ${data.email}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        successMessage={msg}
        onBackToLogin={() => router.push('/login')}
      />
    </div>
  );
}
