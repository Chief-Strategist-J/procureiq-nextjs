import { ApiValidationError } from '@/config/api-endpoints';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const activeRequests = new Map<string, AbortController>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function request<T>(
  url: string,
  options: RequestInit = {},
  actionContext: string,
  retryCount = 3,
  baseDelayMs = 500
): Promise<T> {
  const requestKey = `${options.method || 'GET'}:${url}`;

  // Abort duplicate in-flight requests
  if (activeRequests.has(requestKey)) {
    const controller = activeRequests.get(requestKey);
    controller?.abort();
  }

  const controller = new AbortController();
  activeRequests.set(requestKey, controller);

  const mergedHeaders = { ...DEFAULT_HEADERS, ...options.headers };
  const config: RequestInit = {
    ...options,
    headers: mergedHeaders,
    signal: controller.signal,
  };

  let attempt = 0;

  while (attempt < retryCount) {
    try {
      const response = await fetch(url, config);

      // Request finished, remove from tracking map
      activeRequests.delete(requestKey);

      if (!response.ok) {
        if (response.status === 400) {
          const errorJson = await response.json();
          if (errorJson.data && errorJson.data.details) {
            throw new ApiValidationError(errorJson.data.message || 'Validation failed', errorJson.data.details);
          }
        }
        
        // Don't retry client errors (4xx) except maybe rate limits (429)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }
      } else {
        const result = await response.json();
        return result.data as T;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        throw new Error(`Request to ${actionContext} was aborted due to duplicate request execution.`);
      }

      attempt++;
      if (attempt >= retryCount) {
        activeRequests.delete(requestKey);
        throw new Error(`Failed to ${actionContext} after ${retryCount} retries. Error: ${e.message}`);
      }

      // Exponential backoff delay: baseDelay * 2^attempt
      const backoffDelay = baseDelayMs * Math.pow(2, attempt);
      console.warn(`Retry attempt ${attempt} for ${actionContext} after ${backoffDelay}ms delay...`);
      await delay(backoffDelay);
    }
  }

  activeRequests.delete(requestKey);
  throw new Error(`Failed to ${actionContext}: Unexpected execution end.`);
}
