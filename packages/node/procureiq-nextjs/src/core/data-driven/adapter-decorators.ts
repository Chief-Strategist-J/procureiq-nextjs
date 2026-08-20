import { CrudPort } from "./create-entity-adapter";
import { TelemetryService } from "@/lib/telemetry";

export function withRetry<T>(port: CrudPort<T>, maxRetries = 3): CrudPort<T> {
  const retry = async <R>(fn: () => Promise<R>): Promise<R> => {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) throw err;
      }
    }
  };
  return {
    list: () => retry(() => port.list()),
    get: (id) => retry(() => port.get(id)),
    create: (payload) => retry(() => port.create(payload)),
    update: (id, payload) => retry(() => port.update(id, payload)),
    remove: (id) => retry(() => port.remove(id)),
  };
}

export function withCache<T>(port: CrudPort<T>, ttlMs = 5000): CrudPort<T> {
  const cache = new Map<string, { value: any; expiry: number }>();
  
  const getCached = async <R>(key: string, fn: () => Promise<R>): Promise<R> => {
    const cached = cache.get(key);
    const now = Date.now();
    if (cached && cached.expiry > now) {
      return cached.value;
    }
    const val = await fn();
    cache.set(key, { value: val, expiry: now + ttlMs });
    return val;
  };

  return {
    ...port,
    list: () => getCached("list", () => port.list()),
    get: (id) => getCached(`get:${id}`, () => port.get(id)),
  };
}

export function withCircuitBreaker<T>(
  port: CrudPort<T>,
  failureThreshold = 5,
  cooldownMs = 10000
): CrudPort<T> {
  let failures = 0;
  let state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  let lastFailureTime = 0;

  const execute = async <R>(fn: () => Promise<R>): Promise<R> => {
    const now = Date.now();
    if (state === "OPEN") {
      if (now - lastFailureTime > cooldownMs) {
        state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      if (state === "HALF_OPEN") {
        state = "CLOSED";
        failures = 0;
      }
      return result;
    } catch (err) {
      failures++;
      lastFailureTime = now;
      if (failures >= failureThreshold) {
        state = "OPEN";
      }
      throw err;
    }
  };

  return {
    list: () => execute(() => port.list()),
    get: (id) => execute(() => port.get(id)),
    create: (payload) => execute(() => port.create(payload)),
    update: (id, payload) => execute(() => port.update(id, payload)),
    remove: (id) => execute(() => port.remove(id)),
  };
}

export function withTracing<T>(port: CrudPort<T>, name: string): CrudPort<T> {
  const trace = async <R>(op: string, fn: () => Promise<R>): Promise<R> => {
    const span = TelemetryService.createSpan(`${name}:${op}`);
    try {
      return await fn();
    } catch (err) {
      console.error(`[TRACE] Error in ${name}:${op} (TraceId: ${span.traceId})`, err);
      throw err;
    }
  };

  return {
    list: () => trace("list", () => port.list()),
    get: (id) => trace(`get:${id}`, () => port.get(id)),
    create: (payload) => trace("create", () => port.create(payload)),
    update: (id, payload) => trace(`update:${id}`, () => port.update(id, payload)),
    remove: (id) => trace(`remove:${id}`, () => port.remove(id)),
  };
}
