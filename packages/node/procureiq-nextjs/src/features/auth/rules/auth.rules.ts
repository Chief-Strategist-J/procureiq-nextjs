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

export const AUTH_ROLE_ACCESS_RULES: Rule[] = [
  {
    id: 'role-admin-access',
    name: 'Admin Full System Access',
    category: 'rbac',
    priority: 100,
    conditions: [{ field: 'role', op: 'eq', value: 'admin' }],
    effect: { type: 'allow', target: 'accessLevel', value: 'full' },
  },
  {
    id: 'role-accountant-access',
    name: 'Accountant Financial Module Access',
    category: 'rbac',
    priority: 50,
    conditions: [
      { field: 'role', op: 'eq', value: 'accountant' },
      { field: 'module', op: 'in', value: ['financial', 'accounting', 'billing', 'reports', 'services'] }
    ],
    effect: { type: 'allow', target: 'accessLevel', value: 'module_specific' },
  },
  {
    id: 'role-engineer-access',
    name: 'Engineer Technical Module Access',
    category: 'rbac',
    priority: 50,
    conditions: [
      { field: 'role', op: 'eq', value: 'engineer' },
      { field: 'module', op: 'in', value: ['technical', 'engineering', 'workorders', 'jobs', 'services'] }
    ],
    effect: { type: 'allow', target: 'accessLevel', value: 'module_specific' },
  },
  {
    id: 'role-user-access',
    name: 'Normal User Services Access',
    category: 'rbac',
    priority: 10,
    conditions: [
      { field: 'role', op: 'eq', value: 'user' },
      { field: 'module', op: 'in', value: ['services', 'profile', 'dashboard'] }
    ],
    effect: { type: 'allow', target: 'accessLevel', value: 'user_services' },
  },
];
