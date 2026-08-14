import { z } from 'zod';
import type { JsonMapOp } from '@/core/data-driven/transform.types';

export const userProfileValidator = z.object({
  id: z.coerce.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
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

export const userFromApi: JsonMapOp[] = [
  { op: 'rename', from: 'username', to: 'name' },
  { op: 'omit', fields: ['accountNonLocked', 'emailVerified', 'failedAttemptCount', 'lockTime', 'verificationToken', 'resetToken', 'resetTokenExpiry'] },
  { op: 'default', field: 'companyName', value: '' },
  { op: 'default', field: 'mfaEnabled', value: false },
];

export const loginRequestToApi: JsonMapOp[] = [
  { op: 'rename', from: 'email', to: 'username' },
  { op: 'pick', fields: ['username', 'password'] },
];

export const signupRequestToApi: JsonMapOp[] = [
  { op: 'rename', from: 'name', to: 'username' },
  { op: 'pick', fields: ['username', 'email', 'password', 'companyName', 'agreeToTerms'] },
];
