export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: 'starter' | 'professional' | 'enterprise';
  role?: string;
  isDefault?: boolean;
}

export interface RoleAssignment {
  id: string;
  orgId?: string;
  principalType: 'user' | 'service_account';
  principalId: string;
  scopeType: 'org' | 'workspace';
  scopeId?: string;
  roleName: string;
  expiresAt?: string;
  createdAt: string;
}

export interface AssignRoleInput {
  orgId: string;
  executorId: string;
  principalType: 'user' | 'service_account';
  principalId: string;
  roleId?: number;
  roleName: string;
  scopeType?: 'org' | 'workspace';
  scopeId?: string;
  expiresAt?: string;
}

export interface AuditEvent {
  id: string;
  organizationId?: string;
  actorType: string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  severity: 'info' | 'warning' | 'critical';
  beforeValue?: string;
  afterValue?: string;
  requestId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  prevHash: string;
  entryHash: string;
  occurredAt: string;
}

export interface ChainVerificationResult {
  isValid: boolean;
  totalEventsChecked: number;
  brokenIndex?: number;
  failureReason?: string;
}

export interface IdentityState {
  organizations: Organization[];
  assignments: RoleAssignment[];
  auditEvents: AuditEvent[];
  verificationResult: ChainVerificationResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedOrgId: string;
}
