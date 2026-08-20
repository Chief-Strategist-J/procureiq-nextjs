import { z } from 'zod';
import type { JsonMapOp } from '@/core/data-driven/transform.types';

export const organizationValidator = z.object({
  id: z.coerce.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  tier: z.enum(['starter', 'professional', 'enterprise']).default('starter'),
  role: z.string().default('user'),
  isDefault: z.boolean().default(false),
});

export const roleAssignmentValidator = z.object({
  id: z.coerce.string(),
  orgId: z.coerce.string().optional(),
  principalType: z.enum(['user', 'service_account']).default('user'),
  principalId: z.coerce.string(),
  scopeType: z.enum(['org', 'workspace']).default('org'),
  scopeId: z.coerce.string().optional(),
  roleName: z.string().default('user'),
  expiresAt: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export const auditEventValidator = z.object({
  id: z.coerce.string(),
  organizationId: z.coerce.string().optional(),
  actorType: z.string().default('user'),
  actorId: z.coerce.string().optional(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.coerce.string().optional(),
  severity: z.enum(['info', 'warning', 'critical']).default('info'),
  beforeValue: z.string().optional(),
  afterValue: z.string().optional(),
  requestId: z.string().optional(),
  sessionId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  prevHash: z.string().default('GENESIS'),
  entryHash: z.string().default(''),
  occurredAt: z.string().default(() => new Date().toISOString()),
});

export const chainVerificationValidator = z.object({
  isValid: z.boolean(),
  totalEventsChecked: z.coerce.number().default(0),
  brokenIndex: z.coerce.number().optional(),
  failureReason: z.string().optional(),
});

export const organizationFromApi: JsonMapOp[] = [
  { op: 'coerce', field: 'id', to: 'string' },
  { op: 'default', field: 'tier', value: 'starter' },
  { op: 'default', field: 'role', value: 'user' },
  { op: 'default', field: 'isDefault', value: false },
];

export const roleAssignmentFromApi: JsonMapOp[] = [
  { op: 'coerce', field: 'id', to: 'string' },
  { op: 'coerce', field: 'principalId', to: 'string' },
  { op: 'default', field: 'principalType', value: 'user' },
  { op: 'default', field: 'scopeType', value: 'org' },
  { op: 'default', field: 'roleName', value: 'user' },
];

export const auditEventFromApi: JsonMapOp[] = [
  { op: 'coerce', field: 'id', to: 'string' },
  { op: 'coerce', field: 'actorId', to: 'string' },
  { op: 'coerce', field: 'resourceId', to: 'string' },
  { op: 'coerce', field: 'organizationId', to: 'string' },
  { op: 'default', field: 'severity', value: 'info' },
  { op: 'default', field: 'prevHash', value: 'GENESIS' },
];

export const assignRoleToApi: JsonMapOp[] = [
  { op: 'coerce', field: 'roleId', to: 'number' },
  { op: 'coerce', field: 'principalId', to: 'number' },
  { op: 'default', field: 'roleId', value: 1 },
  { op: 'default', field: 'scopeType', value: 'org' },
  { op: 'pick', fields: ['roleId', 'principalType', 'principalId', 'scopeType', 'scopeId', 'expiresAfterSeconds'] },
];
