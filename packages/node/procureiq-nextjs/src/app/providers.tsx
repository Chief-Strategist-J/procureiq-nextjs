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
    dispatch(authActions.rehydrateAuth());
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
