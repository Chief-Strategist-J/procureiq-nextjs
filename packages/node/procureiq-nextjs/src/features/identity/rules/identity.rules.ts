import type { Rule } from '@/core/rules-engine/rule.types';

export const IDENTITY_BUSINESS_RULES: Rule[] = [
  {
    id: 'rule-critical-audit-event',
    name: 'Critical Audit Severity Classification',
    category: 'security',
    priority: 10,
    conditions: [
      { field: 'action', op: 'contains', value: 'DELETE' }
    ],
    effect: { type: 'set', target: 'severity', value: 'critical' },
  },
  {
    id: 'rule-warning-audit-event',
    name: 'Warning Audit Severity Classification',
    category: 'security',
    priority: 5,
    conditions: [
      { field: 'action', op: 'contains', value: 'UPDATE' }
    ],
    effect: { type: 'set', target: 'severity', value: 'warning' },
  },
  {
    id: 'rule-deny-system-role-tamper',
    name: 'Prevent System Role Alteration',
    category: 'rbac-governance',
    priority: 100,
    conditions: [
      { field: 'roleName', op: 'eq', value: 'SYSTEM_SUPER_ADMIN' },
      { field: 'isSystemRole', op: 'eq', value: true }
    ],
    effect: { type: 'deny', target: 'assignment', value: 'System roles cannot be modified' },
  },
];
