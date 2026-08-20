export interface CacheEntry<T = unknown> {
  data: T;
  expiry: number;
  cancelKey?: string;
}

export class ClientCache {
  private static cache = new Map<string, CacheEntry>();

  public static get<T>(url: string): T | null {
    const entry = ClientCache.cache.get(url);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      ClientCache.cache.delete(url);
      return null;
    }
    return entry.data as T;
  }

  public static set<T>(url: string, data: T, ttlMs: number = 300000, cancelKey?: string): void {
    ClientCache.cache.set(url, {
      data,
      expiry: Date.now() + ttlMs,
      cancelKey,
    });
  }

  public static invalidateTag(tag: string): void {
    if (!tag) return;
    const cleanTag = tag.toLowerCase().trim();
    for (const [url, entry] of ClientCache.cache.entries()) {
      if (entry.cancelKey && entry.cancelKey.toLowerCase().includes(cleanTag)) {
        ClientCache.cache.delete(url);
      } else if (url.toLowerCase().includes(cleanTag.replace('tag:', ''))) {
        ClientCache.cache.delete(url);
      }
    }
  }

  public static clear(): void {
    ClientCache.cache.clear();
  }
}

export function UserCacheable(options: { name: string; ttlMs?: number }) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${options.name}:${propertyKey}:${JSON.stringify(args)}`;
      const cached = ClientCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
      const result = await originalMethod.apply(this, args);
      if (result !== undefined) {
        ClientCache.set(cacheKey, result, options.ttlMs ?? 300000, `tag:${options.name}`);
      }
      return result;
    };
    return descriptor;
  };
}

export function UserCacheEvict(options: { name: string }) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      ClientCache.invalidateTag(`tag:${options.name}`);
      return result;
    };
    return descriptor;
  };
}
