import { request } from "@/shared/utils/apiClient";

export async function fetchWithFallback<T>(
  url: string,
  options: RequestInit,
  localStorageKey: string,
  actionContext: string,
  fallbackCompute: () => T,
  bypassEnvelope = false
): Promise<T> {
  try {
    let data: T;
    if (bypassEnvelope) {
      // Direct JSON parsing for non-standard response shapes (like Python backend)
      const mergedHeaders = { 'Content-Type': 'application/json', ...options.headers };
      const response = await fetch(url, { ...options, headers: mergedHeaders });
      if (!response.ok) throw new Error(response.statusText);
      data = await response.json();
    } else {
      data = await request<T>(url, options, actionContext);
    }
    if (data) {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn(`Backend offline or failed to ${actionContext}. Loading from local database fallback.`, e);
  }
  return fallbackCompute();
}

export async function mutateWithFallback<T extends { id?: number }>(
  url: string,
  options: RequestInit,
  localStorageKey: string,
  actionContext: string,
  localUpdate: (list: any[]) => { updatedList: any[]; returnVal: T },
  bypassEnvelope = false
): Promise<T> {
  try {
    let data: T;
    if (bypassEnvelope) {
      const mergedHeaders = { 'Content-Type': 'application/json', ...options.headers };
      const response = await fetch(url, { ...options, headers: mergedHeaders });
      if (!response.ok) throw new Error(response.statusText);
      data = await response.json();
    } else {
      data = await request<T>(url, options, actionContext);
    }
    if (data) return data;
  } catch (e) {
    console.warn(`Backend offline or failed to ${actionContext}. Saving changes locally.`, e);
  }

  const list = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  const { updatedList, returnVal } = localUpdate(list);
  localStorage.setItem(localStorageKey, JSON.stringify(updatedList));
  return returnVal;
}
