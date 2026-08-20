import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '../utils';

describe('Utility Functions - Unit & Edge Case Tests', () => {
  describe('cn (className merger)', () => {
    it('merges classNames correctly', () => {
      expect(cn('px-2 py-1', 'bg-blue-500')).toBe('px-2 py-1 bg-blue-500');
    });

    it('resolves conflicting tailwind classes correctly', () => {
      expect(cn('px-2 px-4', 'bg-red-500 bg-blue-500')).toBe('px-4 bg-blue-500');
    });

    it('handles falsy values gracefully', () => {
      expect(cn('px-2', false && 'hidden', null, undefined, 'py-1')).toBe('px-2 py-1');
    });
  });

  describe('formatCurrency', () => {
    it('formats standard positive currency correctly', () => {
      expect(formatCurrency(1250.5)).toBe('$1,250.50');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative currency values correctly', () => {
      expect(formatCurrency(-500)).toBe('-$500.00');
    });

    it('formats large numbers without truncation', () => {
      expect(formatCurrency(1000000000)).toBe('$1,000,000,000.00');
    });

    it('supports custom currency codes', () => {
      expect(formatCurrency(100, 'EUR')).toContain('100.00');
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO date strings correctly', () => {
      const result = formatDate('2026-08-04T12:00:00Z');
      expect(result).toContain('2026');
      expect(result).toContain('Aug');
    });

    it('returns empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('returns original input when invalid date string is provided', () => {
      expect(formatDate('not-a-real-date')).toBe('not-a-real-date');
    });
  });
});
