import { describe, it, expect } from 'vitest';
import { authSlice, authActions } from '../../store/auth-slice';
import { AuthState } from '../../types';

export interface MeasuredAuthMetrics {
  totalTransitions: number;
  totalDurationMs: number;
  avgTransitionMs: number;
  p50Ms: number;
  p90Ms: number;
  p99Ms: number;
}

export function measureAuthPerformance(): MeasuredAuthMetrics {
  let state: any = authSlice.getInitialState();

  const samples: number[] = [];
  const totalIterations = 1000;
  const globalStart = performance.now();

  for (let i = 0; i < totalIterations; i++) {
    const t0 = performance.now();
    state = authSlice.reducer(state, authActions.loginRequest({ email: `user${i}@test.com`, password: 'pass' }));
    state = authSlice.reducer(
      state,
      authActions.loginSuccess({
        user: { id: `usr-${i}`, email: `user${i}@test.com`, name: `User ${i}`, role: 'admin' },
        token: `token-${i}`,
      })
    );
    state = authSlice.reducer(state, authActions.logout());
    const t1 = performance.now();
    samples.push(t1 - t0);
  }

  const globalEnd = performance.now();
  samples.sort((a, b) => a - b);

  const totalDurationMs = globalEnd - globalStart;
  const p50Ms = samples[Math.floor(totalIterations * 0.5)];
  const p90Ms = samples[Math.floor(totalIterations * 0.9)];
  const p99Ms = samples[Math.floor(totalIterations * 0.99)];

  return {
    totalTransitions: totalIterations * 3,
    totalDurationMs,
    avgTransitionMs: totalDurationMs / (totalIterations * 3),
    p50Ms,
    p90Ms,
    p99Ms,
  };
}

describe('Auth Module - Real Measured Performance & Edge Cases', () => {
  it('measures real empirical state transition metrics (p50, p90, p99)', () => {
    const metrics = measureAuthPerformance();

    expect(metrics.totalDurationMs).toBeLessThan(2000);
    expect(metrics.avgTransitionMs).toBeLessThan(1.0);
    expect(metrics.p99Ms).toBeLessThan(25);

    console.log(`[REAL MEASURED METRICS] Total Time: ${metrics.totalDurationMs.toFixed(2)}ms | p50: ${metrics.p50Ms.toFixed(4)}ms | p90: ${metrics.p90Ms.toFixed(4)}ms | p99: ${metrics.p99Ms.toFixed(4)}ms`);
  });

  it('handles 10KB payload boundary edge case correctly', () => {
    const hugeEmail = 'a'.repeat(5000) + '@procureiq.com';
    const hugePassword = 'p'.repeat(5000);

    const initialState: any = authSlice.getInitialState();
    const t0 = performance.now();
    const state = authSlice.reducer(initialState, authActions.loginRequest({ email: hugeEmail, password: hugePassword }));
    const t1 = performance.now();

    expect(state.status).toBe('loading');
    expect(t1 - t0).toBeLessThan(20);
  });
});
