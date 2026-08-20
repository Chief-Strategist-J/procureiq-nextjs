import { z } from 'zod';
import type { JsonMapOp } from '@/core/data-driven/transform.types';

export const userRoleSchema = z.enum(['admin', 'accountant', 'engineer', 'user']);

export const tenantIdSchema = z
  .string()
  .min(1, 'Organization / Tenant ID is required')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Tenant ID must contain only alphanumeric characters, hyphens, or underscores');

export const userProfileValidator = z.object({
  id: z.coerce.string(),
  tenantId: z.string().optional().default('default'),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  roles: z.array(userRoleSchema).optional(),
  companyName: z.string().optional(),
  avatarUrl: z.string().optional(),
  mfaEnabled: z.boolean().optional(),
});

export const loginResponseValidator = z.object({
  token: z.string(),
  user: userProfileValidator,
});

export const signupResponseValidator = z.object({
  user: userProfileValidator,
  token: z.string().optional(),
  isAutoLogin: z.boolean().optional(),
});

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password cannot be blank'),
  tenantId: tenantIdSchema,
});

export const signupFormSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(1, 'Company name is required'),
  tenantId: tenantIdSchema,
  agreeToTerms: z.literal(true, {
    message: 'You must accept the terms of service',
  }),
});

export const userFromApi: JsonMapOp[] = [
  { op: 'rename', from: 'username', to: 'name' },
  { op: 'omit', fields: ['accountNonLocked', 'emailVerified', 'failedAttemptCount', 'lockTime', 'verificationToken', 'resetToken', 'resetTokenExpiry'] },
  { op: 'default', field: 'companyName', value: '' },
  { op: 'default', field: 'mfaEnabled', value: false },
];

export const loginRequestToApi: JsonMapOp[] = [
  { op: 'rename', from: 'email', to: 'username' },
  { op: 'pick', fields: ['username', 'password', 'tenantId'] },
];

export const signupRequestToApi: JsonMapOp[] = [
  { op: 'rename', from: 'name', to: 'username' },
  { op: 'pick', fields: ['username', 'email', 'password', 'companyName', 'role', 'tenantId', 'roleMetadata', 'agreeToTerms'] },
];
