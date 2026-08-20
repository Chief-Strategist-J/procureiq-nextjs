import { SignupInput, UserRole } from '../types';

export interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

export const ROLE_FIELDS_SCHEMA: Record<UserRole, FieldConfig[]> = {
  user: [
    { key: 'employeeId', label: 'Employee ID', placeholder: 'EMP-88219', required: true },
    { key: 'department', label: 'Department', placeholder: 'Strategic Sourcing' }
  ],
  accountant: [
    { key: 'cpaLicenseNumber', label: 'CPA / Auditor License Number', placeholder: 'CPA-994102', required: true },
    { key: 'taxIdVat', label: 'Tax ID / VAT Registration', placeholder: 'VAT-990182' }
  ],
  engineer: [
    { key: 'engineeringLicenseNo', label: 'Engineering License Number', placeholder: 'PE-77402', required: true },
    { key: 'specialization', label: 'Technical Specialization', placeholder: 'Quality Control' }
  ],
  admin: [
    { key: 'adminClearanceLevel', label: 'Admin Clearance Level', placeholder: 'ORG_ADMIN', required: true },
    { key: 'authorizationGrantCode', label: 'Authorization Code', placeholder: 'AUTH-KEY-881' }
  ]
};

export function resolveActiveRoleFields(roles: UserRole[]): FieldConfig[] {
  return roles.flatMap((r) => ROLE_FIELDS_SCHEMA[r] || []);
}

export function formatRoleListDisplay(roles: UserRole[]): string {
  return roles.map((r) => r.toUpperCase()).join(', ');
}

export function normalizeTenantId(tenantId?: string): string {
  if (!tenantId || !tenantId.trim()) return 'default';
  return tenantId.trim().toLowerCase();
}

export function transformSignupFormToApiPayload(input: SignupInput, activeRoles: UserRole[]): SignupInput {
  return {
    ...input,
    tenantId: normalizeTenantId(input.tenantId),
    role: activeRoles.join(',') as UserRole,
  };
}
