import { describe, it, expect } from 'vitest';
import { authSlice, authActions } from '../../store/auth-slice';
import { AuthState } from '../../types';

describe('Auth Redux Slice - Unit Tests', () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null,
    status: 'idle',
    error: null,
  };

  it('returns initial state on unknown action', () => {
    expect(authSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('transitions state to loading on loginRequest', () => {
    const state = authSlice.reducer(
      initialState,
      authActions.loginRequest({ email: 'user@procureiq.com', password: 'password' })
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('populates user state on loginSuccess', () => {
    const mockUser = { id: 'usr-1', email: 'user@procureiq.com', name: 'User', role: 'admin' as const };
    const state = authSlice.reducer(
      { ...initialState, status: 'loading' },
      authActions.loginSuccess({ user: mockUser, token: 'jwt-123' })
    );

    expect(state.status).toBe('succeeded');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('jwt-123');
  });

  it('records error on loginFailure', () => {
    const state = authSlice.reducer(
      { ...initialState, status: 'loading' },
      authActions.loginFailure('Unauthorized')
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Unauthorized');
    expect(state.isAuthenticated).toBe(false);
  });

  it('clears state on logout', () => {
    const activeState: AuthState = {
      user: { id: 'usr-1', email: 'u@procureiq.com', name: 'User', role: 'admin' },
      isAuthenticated: true,
      token: 'jwt-token',
      status: 'succeeded',
      error: null,
    };

    const state = authSlice.reducer(activeState, authActions.logout());
    expect(state).toEqual(initialState);
  });
});
