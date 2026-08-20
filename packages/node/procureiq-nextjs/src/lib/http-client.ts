import { API_BASE_URL } from './api-endpoints';
import { TelemetryService } from './telemetry';
import { ClientCache } from './client-cache';

export interface ApiSingleResponse<T> {
  status: number | string;
  code?: number;
  success?: boolean;
  data?: any;
  message?: string;
  error?: any;
}

export type ErrorExtractorRule = (responseData: any, httpStatus: number) => string | null;

export const ERROR_EXTRACTOR_PIPELINE: ErrorExtractorRule[] = [
  (responseData) => {
    if (responseData?.data?.details && typeof responseData.data.details === 'object') {
      const details = responseData.data.details;
      const messages = Object.entries(details)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');
      if (messages) return messages;
    }
    return null;
  },
  (responseData) => (typeof responseData?.data?.message === 'string' ? responseData.data.message : null),
  (responseData) => (typeof responseData?.error === 'string' ? responseData.error : null),
  (responseData) => (typeof responseData?.error?.message === 'string' ? responseData.error.message : null),
  (responseData) => (typeof responseData?.message === 'string' ? responseData.message : null),
  (_responseData, httpStatus) => `HTTP ${httpStatus}: Request failed`,
];

export function extractErrorMessage(responseData: any, httpStatus: number): string {
  if (!responseData) {
    return `HTTP ${httpStatus}: Request failed`;
  }
  for (const rule of ERROR_EXTRACTOR_PIPELINE) {
    const result = rule(responseData, httpStatus);
    if (result) return result;
  }
  return `HTTP ${httpStatus}: Request failed`;
}

export class HttpClient {
  private static token: string | null = null;

  public static setAuthToken(token: string | null): void {
    HttpClient.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  public static getAuthToken(): string | null {
    if (!HttpClient.token && typeof window !== 'undefined') {
      HttpClient.token = localStorage.getItem('auth_token');
    }
    return HttpClient.token;
  }

  private static tenantId: string = 'default-tenant';

  public static setTenantId(tenantId: string): void {
    HttpClient.tenantId = tenantId;
  }

  private static getHeaders(endpoint: string, headers: Record<string, string> = {}, isMutating = false): Record<string, string> {
    const span = TelemetryService.createSpan(`http-request:${endpoint}`);
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Request-Id': requestId,
      'X-Trace-Id': span.traceId,
      'X-Correlation-Id': span.correlationId,
      'X-Tenant-Id': HttpClient.tenantId,
      traceparent: span.traceParent,
      ...headers,
    };

    if (isMutating && !defaultHeaders['Idempotency-Key'] && !defaultHeaders['idempotency-key']) {
      defaultHeaders['Idempotency-Key'] = `ik-${span.correlationId}`;
    }

    if (HttpClient.token) {
      defaultHeaders['Authorization'] = `Bearer ${HttpClient.token}`;
    }

    return defaultHeaders;
  }

  private static handleCacheInvalidationHeaders(response: Response, endpoint: string): void {
    const cancelKey = response.headers.get('x-cache-cancel-key');
    const evictedKeys = response.headers.get('x-cache-evicted-keys');
    if (cancelKey) ClientCache.invalidateTag(cancelKey);
    if (evictedKeys) ClientCache.invalidateTag(evictedKeys);
    if (!cancelKey && !evictedKeys) ClientCache.invalidateTag(endpoint);
  }

  public static async post<TReq, TRes>(
    endpoint: string,
    body: TReq,
    customHeaders?: Record<string, string>
  ): Promise<TRes> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: HttpClient.getHeaders(endpoint, customHeaders, true),
        body: JSON.stringify(body),
      });

      HttpClient.handleCacheInvalidationHeaders(response, endpoint);

      const responseData: any = await response.json();
      const code = responseData?.code || response.status;
      const isSuccess = response.ok && (code === 200 || code === 201) && responseData?.status !== 'error';

      if (!isSuccess) {
        const errorMsg = extractErrorMessage(responseData, response.status);
        throw new Error(errorMsg);
      }

      return (responseData.data ?? responseData) as TRes;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || 'Network request failed');
    }
  }

  public static async get<TRes>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<TRes> {
    const url = `${API_BASE_URL}${endpoint}`;
    const cached = ClientCache.get<TRes>(url);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: HttpClient.getHeaders(endpoint, customHeaders),
      });

      const cancelKey = response.headers.get('x-cache-cancel-key') ?? undefined;
      const cacheStatus = response.headers.get('x-cache-status');

      const responseData: any = await response.json();
      const code = responseData?.code || response.status;
      const isSuccess = response.ok && (code === 200 || code === 201) && responseData?.status !== 'error';

      if (!isSuccess) {
        const errorMsg = extractErrorMessage(responseData, response.status);
        throw new Error(errorMsg);
      }

      const result = (responseData.data ?? responseData) as TRes;
      if (cacheStatus !== 'BYPASS') {
        ClientCache.set(url, result, 300000, cancelKey);
      }

      return result;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || 'Network request failed');
    }
  }

  public static async patch<TReq, TRes>(
    endpoint: string,
    body: TReq,
    customHeaders?: Record<string, string>
  ): Promise<TRes> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: HttpClient.getHeaders(endpoint, customHeaders, true),
        body: JSON.stringify(body),
      });

      HttpClient.handleCacheInvalidationHeaders(response, endpoint);

      const responseData: any = await response.json();
      const code = responseData?.code || response.status;
      const isSuccess = response.ok && (code === 200 || code === 201) && responseData?.status !== 'error';

      if (!isSuccess) {
        const errorMsg = extractErrorMessage(responseData, response.status);
        throw new Error(errorMsg);
      }

      return (responseData.data ?? responseData) as TRes;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || 'Network request failed');
    }
  }

  public static async delete<TRes = void>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<TRes> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: HttpClient.getHeaders(endpoint, customHeaders, true),
      });

      HttpClient.handleCacheInvalidationHeaders(response, endpoint);

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch {
        // Handle cases where DELETE returns empty body
      }
      const code = responseData?.code || response.status;
      const isSuccess = response.ok && (code === 200 || code === 204 || code === 201) && responseData?.status !== 'error';

      if (!isSuccess) {
        const errorMsg = extractErrorMessage(responseData, response.status);
        throw new Error(errorMsg);
      }

      return (responseData.data ?? responseData) as TRes;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || 'Network request failed');
    }
  }
}
