import { describe, it, expect } from 'vitest';
import { authSlice, authActions } from '../../store/auth-slice';
import { AuthState } from '../../types';

describe('Auth Module - System Testing (Full State Machine Lifecycle)', () => {
  it('validates complete state transition lifecycle: Idle -> Loading -> Succeeded -> Logged Out', () => {
    let state: AuthState = authSlice.reducer(undefined, { type: '@@INIT' });
    expect(state.status).toBe('idle');
    expect(state.isAuthenticated).toBe(false);

    state = authSlice.reducer(state, authActions.loginRequest({ email: 'system@procureiq.com', password: 'pass' }));
    expect(state.status).toBe('loading');

    const userPayload = { id: 'sys-1', email: 'system@procureiq.com', name: 'System User', role: 'admin' as const };
    state = authSlice.reducer(state, authActions.loginSuccess({ user: userPayload, token: 'sys-jwt' }));
    expect(state.status).toBe('succeeded');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(userPayload);

    state = authSlice.reducer(state, authActions.logout());
    expect(state.status).toBe('idle');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
