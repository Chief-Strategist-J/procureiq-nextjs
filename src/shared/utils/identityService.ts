import { RoleAssignment, AssignRoleRequest, AuditEvent, ChainVerificationResult } from '@/shared/types/identity';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6565';

export class IdentityService {
  private static instance: IdentityService;

  private constructor() {}

  public static getInstance(): IdentityService {
    if (!IdentityService.instance) {
      IdentityService.instance = new IdentityService();
    }
    return IdentityService.instance;
  }

  public async getAssignments(
    orgId: string,
    principalType: 'user' | 'service_account' | 'group',
    principalId: string
  ): Promise<RoleAssignment[]> {
    const params = new URLSearchParams({ principalType, principalId });
    const response = await fetch(`${API_BASE}/api/v1/identity/organizations/${orgId}/assignments?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch role assignments: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data || [];
  }

  public async assignRole(orgId: string, executorId: string, request: AssignRoleRequest): Promise<void> {
    const params = new URLSearchParams({ executorId });
    const response = await fetch(`${API_BASE}/api/v1/identity/organizations/${orgId}/assignments?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign role: ${response.statusText}`);
    }
  }

  public async getAuditEvents(orgId: string): Promise<AuditEvent[]> {
    const response = await fetch(`${API_BASE}/api/v1/identity/organizations/${orgId}/audit-events`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audit events: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data || [];
  }

  public async verifyAuditChain(orgId: string): Promise<ChainVerificationResult> {
    const response = await fetch(`${API_BASE}/api/v1/identity/organizations/${orgId}/audit-events/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to verify audit chain: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  }
}

export const identityService = IdentityService.getInstance();
