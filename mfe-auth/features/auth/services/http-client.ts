import { tracingService } from "./tracing-service"

export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string>
}

export class HttpClient {
  private static instance: HttpClient

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  public async request<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
    const trace = tracingService.createTrace("http.request", {
      "http.url": url,
      "http.method": options.method || "GET",
    })

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Trace-Id": trace.traceId,
      "X-Span-Id": trace.spanId,
      ...(options.headers as Record<string, string>),
    }

    let requestUrl = url
    if (options.params) {
      const searchParams = new URLSearchParams(options.params)
      requestUrl = `${url}?${searchParams.toString()}`
    }

    try {
      const response = await fetch(requestUrl, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        tracingService.createTrace("http.response_error", {
          "http.status_code": response.status,
          "http.error": errorData.message || "HTTP Error",
        })
        throw new Error(errorData.message || `HTTP Request failed with status ${response.status}`)
      }

      const data = await response.json()
      tracingService.createTrace("http.response_success", {
        "http.status_code": response.status,
      })
      return (data.data !== undefined ? data.data : data) as T
    } catch (error: any) {
      tracingService.createTrace("http.request_failed", {
        "error.message": error.message || "Network Error",
      })
      throw error
    }
  }

  public async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  public async post<T>(url: string, body?: any, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}

export const httpClient = HttpClient.getInstance()
