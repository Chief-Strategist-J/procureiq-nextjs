import { API_BASE_URL } from './api-endpoints';

export interface ApiSingleResponse<T> {
  status: number;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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

      const responseData: ApiSingleResponse<TRes> = await response.json();

      if (!response.ok || !responseData.success) {
        const errorMsg =
          responseData.message || responseData.error || `HTTP ${response.status}: Request failed`;
        throw new Error(errorMsg);
      }

      return responseData.data as TRes;
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

      const responseData: ApiSingleResponse<TRes> = await response.json();

      if (!response.ok || !responseData.success) {
        const errorMsg =
          responseData.message || responseData.error || `HTTP ${response.status}: Request failed`;
        throw new Error(errorMsg);
      }

      return responseData.data as TRes;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || 'Network request failed');
    }
  }
}
