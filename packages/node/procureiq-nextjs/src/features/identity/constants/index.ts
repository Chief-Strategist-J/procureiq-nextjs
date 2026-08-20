export const IDENTITY_ENDPOINTS = {
  ORGANIZATIONS: '/api/v1/identity/organizations',
  ASSIGNMENTS: (orgId: string) => `/api/v1/identity/organizations/${encodeURIComponent(orgId)}/assignments`,
  AUDIT_EVENTS: (orgId: string) => `/api/v1/identity/organizations/${encodeURIComponent(orgId)}/audit-events`,
  VERIFY_CHAIN: (orgId: string) => `/api/v1/identity/organizations/${encodeURIComponent(orgId)}/audit-events/verify`,
} as const;

export const DEFAULT_ORG_ID = 'org-primary';
