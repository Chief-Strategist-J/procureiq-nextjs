import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../http-client';
import { API_ENDPOINTS } from '../api-endpoints';

describe('HttpClient - Centralized HTTP Client Unit Tests', () => {
  beforeEach(() => {
    HttpClient.setAuthToken(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('manages authorization token correctly', () => {
    expect(HttpClient.getAuthToken()).toBeNull();
    HttpClient.setAuthToken('token-123');
    expect(HttpClient.getAuthToken()).toBe('token-123');
  });

  it('sends POST request with JSON body and authorization header', async () => {
    HttpClient.setAuthToken('bearer-jwt-token');

    const mockResponse = {
      status: 200,
      success: true,
      data: { token: 'mock-jwt-res', user: { id: 'usr-1', email: 'test@procureiq.com' } },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    const result = await HttpClient.post('/api/v1/auth/login', {
      email: 'test@procureiq.com',
      password: 'password123',
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer bearer-jwt-token',
        }),
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('throws error when server responds with failure status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        status: 401,
        success: false,
        message: 'Invalid credentials provided',
      }),
    } as Response);

    await expect(
      HttpClient.post(API_ENDPOINTS.AUTH.LOGIN, { email: 'bad@test.com', password: 'wrong' })
    ).rejects.toThrow('Invalid credentials provided');
  });

  it('handles network disconnection edge cases gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      HttpClient.post(API_ENDPOINTS.AUTH.LOGIN, { email: 'test@test.com', password: 'pass' })
    ).rejects.toThrow('Failed to fetch');
  });
});
