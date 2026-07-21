/**
 * Generic resource API factory.
 * Eliminates repeated boilerplate across all feature api-client files.
 * Every feature gets list/create/update/delete for free via createResourceApi().
 */

import { AppConfig } from '@/config/app-config';
import { fetchWithFallback, mutateWithFallback } from '@/shared/utils/fallbackClient';
import { request } from '@/shared/utils/apiClient';

const BASE = AppConfig.apiUrl;

export interface ResourceEndpoints {
  list: string;
  create: string;
  update: (id: string) => string;
  delete: (id: string) => string;
  [key: string]: string | ((id: string) => string);
}

export interface ResourceApiOptions<T extends { id: number }> {
  /** API_ENDPOINTS.xxx config object */
  endpoints: ResourceEndpoints;
  /** localStorage key for offline fallback */
  storageKey: string;
  /** Human-readable name for error messages */
  label: string;
  /** Seed data for first-time offline initialisation */
  seed?: T[];
}

export function createResourceApi<T extends { id: number }>(opts: ResourceApiOptions<T>) {
  const { endpoints, storageKey, label, seed } = opts;

  function init() {
    if (typeof window !== 'undefined' && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(seed ?? []));
    }
  }

  function getAll(): T[] {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }

  return {
    init,

    async list(): Promise<T[]> {
      init();
      return fetchWithFallback<T[]>(
        `${BASE}${endpoints.list}`,
        { method: 'GET' },
        storageKey,
        `list ${label}`,
        getAll
      );
    },

    async create(data: Omit<T, 'id'>): Promise<T> {
      init();
      return mutateWithFallback<T>(
        `${BASE}${endpoints.create}`,
        { method: 'POST', body: JSON.stringify(data) },
        storageKey,
        `create ${label}`,
        (list) => {
          const newId = list.length > 0 ? Math.max(...list.map((x: any) => x.id)) + 1 : 1;
          const newItem = { id: newId, ...data } as T;
          return { updatedList: [...list, newItem], returnVal: newItem };
        }
      );
    },

    async update(id: number, data: Omit<T, 'id'>): Promise<T> {
      init();
      return mutateWithFallback<T>(
        `${BASE}${endpoints.update(String(id))}`,
        { method: 'PUT', body: JSON.stringify(data) },
        storageKey,
        `update ${label}`,
        (list) => {
          const updatedList = list.map((x: any) => (x.id === id ? { ...x, ...data } : x));
          return { updatedList, returnVal: { id, ...data } as T };
        }
      );
    },

    async remove(id: number): Promise<void> {
      init();
      await mutateWithFallback<any>(
        `${BASE}${endpoints.delete(String(id))}`,
        { method: 'DELETE' },
        storageKey,
        `delete ${label}`,
        (list) => ({
          updatedList: list.filter((x: any) => x.id !== id),
          returnVal: {},
        })
      );
    },

    /** Generic GET to a sub-resource URL, returns array */
    async get<R>(url: string, context: string): Promise<R> {
      return (await request<R>(`${BASE}${url}`, { method: 'GET' }, context)) as R;
    },

    /** Generic POST to a sub-resource URL */
    async post<R>(url: string, body: object, context: string): Promise<R> {
      return (await request<R>(`${BASE}${url}`, { method: 'POST', body: JSON.stringify(body) }, context)) as R;
    },
  };
}
