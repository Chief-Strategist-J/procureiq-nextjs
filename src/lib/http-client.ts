import { API_BASE_URL } from './api-endpoints';

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

function generateTraceId(): string {
  const chars = '0123456789abcdef';
  let traceId = '';
  for (let i = 0; i < 32; i++) {
    traceId += chars[Math.floor(Math.random() * 16)];
  }
  return traceId;
}

function generateSpanId(): string {
  const chars = '0123456789abcdef';
  let spanId = '';
  for (let i = 0; i < 16; i++) {
    spanId += chars[Math.floor(Math.random() * 16)];
  }
  return spanId;
}

export class HttpClient {
  private static token: string | null = null;

  public static setAuthToken(token: string | null): void {
    HttpClient.token = token;
  }

  public static getAuthToken(): string | null {
    return HttpClient.token;
  }

  private static getHeaders(headers: Record<string, string> = {}): Record<string, string> {
    const traceId = generateTraceId();
    const spanId = generateSpanId();
    const correlationId = `corr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Trace-Id': traceId,
      'X-Correlation-Id': correlationId,
      traceparent: `00-${traceId}-${spanId}-01`,
      ...headers,
    };

    if (HttpClient.token) {
      defaultHeaders['Authorization'] = `Bearer ${HttpClient.token}`;
    }

    return defaultHeaders;
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
        headers: HttpClient.getHeaders(customHeaders),
        body: JSON.stringify(body),
      });

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

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: HttpClient.getHeaders(customHeaders),
      });

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
}
