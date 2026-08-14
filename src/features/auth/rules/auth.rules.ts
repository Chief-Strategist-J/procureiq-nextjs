import type { Rule } from '@/core/rules-engine/rule.types';

export type AuthDialogType = 'lockout' | 'info' | 'error';

export const AUTH_ERROR_RULES: Rule[] = [
  {
    id: 'auth-lockout',
    name: 'Account Lockout',
    category: 'auth-error',
    priority: 10,
    conditions: [{ field: 'errorMessage', op: 'contains', value: 'locked' }],
    effect: { type: 'flag', target: 'dialogType', value: 'lockout' satisfies AuthDialogType },
  },
  {
    id: 'auth-duplicate-email',
    name: 'Account Already Exists',
    category: 'auth-error',
    priority: 5,
    conditions: [{ field: 'errorMessage', op: 'contains', value: 'already exist' }],
    effect: { type: 'flag', target: 'dialogType', value: 'info' satisfies AuthDialogType },
  },
];
