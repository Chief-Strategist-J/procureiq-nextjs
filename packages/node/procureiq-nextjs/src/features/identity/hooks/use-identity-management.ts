import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { identityActions } from '../store/identity-slice';
import type { AssignRoleInput } from '../types';

export function useIdentityManagement() {
  const dispatch = useAppDispatch();

  const organizations = useAppSelector((state) => (state as any).identity?.organizations ?? []);
  const assignments = useAppSelector((state) => (state as any).identity?.assignments ?? []);
  const auditEvents = useAppSelector((state) => (state as any).identity?.auditEvents ?? []);
  const verificationResult = useAppSelector((state) => (state as any).identity?.verificationResult ?? null);
  const status = useAppSelector((state) => (state as any).identity?.status ?? 'idle');
  const error = useAppSelector((state) => (state as any).identity?.error ?? null);
  const selectedOrgId = useAppSelector((state) => (state as any).identity?.selectedOrgId ?? 'org-primary');

  const setOrgId = (orgId: string) => {
    dispatch(identityActions.setSelectedOrgId(orgId));
  };

  const fetchOrganizations = () => {
    dispatch(identityActions.fetchOrganizationsRequest());
  };

  const fetchAssignments = (orgId = selectedOrgId, principalType?: string, principalId?: string) => {
    dispatch(identityActions.fetchAssignmentsRequest({ orgId, principalType, principalId }));
  };

  const assignRole = (input: AssignRoleInput) => {
    dispatch(identityActions.assignRoleRequest(input));
  };

  const fetchAuditEvents = (orgId = selectedOrgId) => {
    dispatch(identityActions.fetchAuditEventsRequest(orgId));
  };

  const verifyAuditChain = (orgId = selectedOrgId) => {
    dispatch(identityActions.verifyAuditChainRequest(orgId));
  };

  const resetStatus = () => {
    dispatch(identityActions.resetIdentityStatus());
  };

  return {
    organizations,
    assignments,
    auditEvents,
    verificationResult,
    status,
    isLoading: status === 'loading',
    error,
    selectedOrgId,
    setOrgId,
    fetchOrganizations,
    fetchAssignments,
    assignRole,
    fetchAuditEvents,
    verifyAuditChain,
    resetStatus,
  };
}
