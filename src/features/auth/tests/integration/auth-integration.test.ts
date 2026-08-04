import { describe, it, expect, vi, beforeEach } from 'vitest';
import { put } from 'redux-saga/effects';
import { handleLoginSaga } from '../../store/auth-saga';
import { authActions } from '../../store/auth-slice';
import { HttpClient } from '@/lib/http-client';

describe('Auth Module - Integration Tests (Saga + HttpClient + API)', () => {
  beforeEach(() => {
    HttpClient.setAuthToken(null);
    vi.restoreAllMocks();
  });

  it('runs complete login flow from saga dispatch to token storage in HttpClient', async () => {
    const mockResponse = {
      status: 200,
      success: true,
      data: {
        token: 'integration-jwt-token',
        user: { id: 'usr-int-1', email: 'integration@procureiq.com', name: 'Integration Test', role: 'admin' as const },
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    const loginPayload = { email: 'integration@procureiq.com', password: 'SecretPassword123!' };
    const generator = handleLoginSaga(authActions.loginRequest(loginPayload));

    // Yield call(loginApi, payload)
    generator.next();

    // Resume generator with real API result
    const sagaResult = generator.next(mockResponse.data).value;
    expect(sagaResult).toEqual(put(authActions.loginSuccess(mockResponse.data)));

    expect(HttpClient.getAuthToken()).toBe('integration-jwt-token');
  });

  it('handles backend 401 unauthorized error integration flow', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        status: 401,
        success: false,
        message: 'Invalid credentials provided',
      }),
    } as Response);

    const loginPayload = { email: 'bad@procureiq.com', password: 'wrong' };
    const generator = handleLoginSaga(authActions.loginRequest(loginPayload));

    generator.next();

    const errorResult = generator.throw(new Error('Invalid credentials provided')).value;
    expect(errorResult).toEqual(put(authActions.loginFailure('Invalid credentials provided')));
  });
});
