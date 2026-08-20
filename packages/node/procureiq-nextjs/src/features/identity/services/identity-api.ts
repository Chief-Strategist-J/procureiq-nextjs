import { HttpClient } from '@/lib/http-client';
import { mapJson } from '@/core/data-driven/json-map';
import { IDENTITY_ENDPOINTS } from '../constants';
import {
  organizationValidator,
  roleAssignmentValidator,
  auditEventValidator,
  chainVerificationValidator,
  organizationFromApi,
  roleAssignmentFromApi,
  auditEventFromApi,
  assignRoleToApi,
} from '../schema/identity.schema';
import type { Organization, RoleAssignment, AuditEvent, AssignRoleInput, ChainVerificationResult } from '../types';

export async function fetchOrganizationsApi(): Promise<Organization[]> {
  const endpoint = IDENTITY_ENDPOINTS.ORGANIZATIONS;
  const res = await HttpClient.get<unknown>(endpoint);
  const rawList: Record<string, unknown>[] =
    res && typeof res === 'object' && 'data' in res && Array.isArray((res as { data: unknown }).data)
      ? ((res as { data: Record<string, unknown>[] }).data)
      : Array.isArray(res)
      ? (res as Record<string, unknown>[])
      : [];

  return rawList.map((raw) => {
    const mapped = mapJson(raw, organizationFromApi);
    return organizationValidator.parse(mapped);
  });
}

export async function fetchRoleAssignmentsApi(
  orgId: string,
  principalType = 'user',
  principalId = '1'
): Promise<RoleAssignment[]> {
  const baseUrl = IDENTITY_ENDPOINTS.ASSIGNMENTS(orgId);
  const endpoint = `${baseUrl}?principalType=${encodeURIComponent(principalType)}&principalId=${encodeURIComponent(principalId)}`;
  const res = await HttpClient.get<unknown>(endpoint);
  const rawList: Record<string, unknown>[] =
    res && typeof res === 'object' && 'data' in res && Array.isArray((res as { data: unknown }).data)
      ? ((res as { data: Record<string, unknown>[] }).data)
      : Array.isArray(res)
      ? (res as Record<string, unknown>[])
      : [];
  
  return rawList.map((raw) => {
    const mapped = mapJson(raw, roleAssignmentFromApi);
    return roleAssignmentValidator.parse(mapped);
  });
}

export async function assignRoleApi(input: AssignRoleInput): Promise<void> {
  const baseUrl = IDENTITY_ENDPOINTS.ASSIGNMENTS(input.orgId);
  const endpoint = `${baseUrl}?executorId=${encodeURIComponent(input.executorId)}`;
  const payload = mapJson(input as unknown as Record<string, unknown>, assignRoleToApi);
  await HttpClient.post(endpoint, payload);
}

export async function fetchAuditEventsApi(orgId: string): Promise<AuditEvent[]> {
  const endpoint = IDENTITY_ENDPOINTS.AUDIT_EVENTS(orgId);
  const res = await HttpClient.get<unknown>(endpoint);
  const rawList: Record<string, unknown>[] =
    res && typeof res === 'object' && 'data' in res && Array.isArray((res as { data: unknown }).data)
      ? ((res as { data: Record<string, unknown>[] }).data)
      : Array.isArray(res)
      ? (res as Record<string, unknown>[])
      : [];

  return rawList.map((raw) => {
    const mapped = mapJson(raw, auditEventFromApi);
    return auditEventValidator.parse(mapped);
  });
}

export async function verifyAuditChainApi(orgId: string): Promise<ChainVerificationResult> {
  const endpoint = IDENTITY_ENDPOINTS.VERIFY_CHAIN(orgId);
  const res = await HttpClient.post<unknown, unknown>(endpoint, {});
  const data = (res && typeof res === 'object' && 'data' in res ? (res as { data: Record<string, unknown> }).data : res) as Record<string, unknown> | undefined;
  return chainVerificationValidator.parse({
    isValid: Boolean(data?.isValid),
    totalEventsChecked: data?.totalEventsChecked ?? 0,
    brokenIndex: data?.failedEventId ? Number(data.failedEventId) : data?.brokenIndex,
    failureReason: data?.message ?? data?.failureReason,
  });
}
