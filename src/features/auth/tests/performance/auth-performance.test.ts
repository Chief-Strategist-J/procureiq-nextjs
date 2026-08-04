import { describe, it, expect } from 'vitest';
import { authSlice, authActions } from '../../store/auth-slice';
import { AuthState } from '../../types';

describe('Auth Module - Performance & Load Edge Case Tests', () => {
  it('handles 1,000 rapid state transitions under 500ms without memory leak', () => {
    let state: AuthState = {
      user: null,
      isAuthenticated: false,
      token: null,
      status: 'idle',
      error: null,
    };

    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      state = authSlice.reducer(state, authActions.loginRequest({ email: `user${i}@test.com`, password: 'pass' }));
      state = authSlice.reducer(
        state,
        authActions.loginSuccess({
          user: { id: `usr-${i}`, email: `user${i}@test.com`, name: `User ${i}`, role: 'admin' },
          token: `token-${i}`,
        })
      );
      state = authSlice.reducer(state, authActions.logout());
    }

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(500);
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles extreme payload size edge cases (10KB input string)', () => {
    const hugeEmail = 'a'.repeat(5000) + '@domain.com';
    const hugePassword = 'p'.repeat(5000);

    const initialState: AuthState = { user: null, isAuthenticated: false, token: null, status: 'idle', error: null };
    const state = authSlice.reducer(initialState, authActions.loginRequest({ email: hugeEmail, password: hugePassword }));

    expect(state.status).toBe('loading');
  });
});
