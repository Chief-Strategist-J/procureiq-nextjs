import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function isStringEmpty(str?: string | null): boolean {
  return !str || str.trim().length === 0;
}

export function normalizeString(str?: string | null): string {
  if (isStringEmpty(str)) {
    return '';
  }
  return str!.trim().toLowerCase().replace(/\s+/g, '');
}

export function safeEqualsStrict(str1?: string | null, str2?: string | null): boolean {
  if (isStringEmpty(str1) && isStringEmpty(str2)) {
    return true;
  }
  if (isStringEmpty(str1) || isStringEmpty(str2)) {
    return false;
  }
  return normalizeString(str1) === normalizeString(str2);
}

export function safeEqualsIgnoreCase(str1?: string | null, str2?: string | null): boolean {
  if (isStringEmpty(str1) && isStringEmpty(str2)) {
    return true;
  }
  if (isStringEmpty(str1) || isStringEmpty(str2)) {
    return false;
  }
  return str1!.trim().toLowerCase() === str2!.trim().toLowerCase();
}
