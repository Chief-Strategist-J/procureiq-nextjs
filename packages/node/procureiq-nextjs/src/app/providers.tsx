'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import '@/features/auth';
import '@/features/identity';
import '@/features/tvm';
import { authActions } from '@/features/auth/store/auth-slice';
import { store } from '@/shared/store';
import { useAppDispatch } from '@/shared/store/hooks';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initial rehydration check on mount
    dispatch(authActions.rehydrateAuth());

    // Periodic check every 60 seconds to auto-logout active tabs when 24 hours elapse
    const interval = setInterval(() => {
      dispatch(authActions.rehydrateAuth());
    }, 60_000);

    // Re-check session age when user switches back to browser tab
    const handleFocus = () => {
      dispatch(authActions.rehydrateAuth());
    };

    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
