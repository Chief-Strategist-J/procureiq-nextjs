import { describe, it, expect } from 'vitest';
import { identitySlice, identityActions } from '../../store/identity-slice';
import type { Organization, RoleAssignment, AuditEvent } from '../../types';

describe('Identity Redux Slice - Multi-Organization Unit Tests', () => {
  const initialState = identitySlice.getInitialState();

  it('returns initial state on unknown action', () => {
    const state = identitySlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('updates selectedOrgId', () => {
    const state = identitySlice.reducer(initialState, identityActions.setSelectedOrgId('org-42'));
    expect(state.selectedOrgId).toBe('org-42');
  });

  it('transitions state to loading on fetchOrganizationsRequest', () => {
    const state = identitySlice.reducer(initialState, identityActions.fetchOrganizationsRequest());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('populates organizations and updates default selectedOrgId on fetchOrganizationsSuccess', () => {
    const mockOrgs: Organization[] = [
      { id: 'org-1', name: 'Acme Corp', slug: 'acme-corp', tier: 'enterprise', role: 'admin', isDefault: true },
      { id: 'org-2', name: 'Beta Labs', slug: 'beta-labs', tier: 'starter', role: 'user' },
    ];
    const state = identitySlice.reducer(
      { ...initialState, status: 'loading' },
      identityActions.fetchOrganizationsSuccess(mockOrgs)
    );

    expect(state.status).toBe('succeeded');
    expect(state.organizations).toEqual(mockOrgs);
    expect(state.selectedOrgId).toBe('org-1');
    expect(state.error).toBeNull();
  });

  it('records error on fetchOrganizationsFailure', () => {
    const state = identitySlice.reducer(
      { ...initialState, status: 'loading' },
      identityActions.fetchOrganizationsFailure('Failed to fetch orgs')
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to fetch orgs');
  });

  it('transitions state to loading on fetchAssignmentsRequest', () => {
    const state = identitySlice.reducer(initialState, identityActions.fetchAssignmentsRequest({ orgId: 'org-1' }));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('populates assignments on fetchAssignmentsSuccess', () => {
    const mockAssignments: RoleAssignment[] = [
      {
        id: 'ra-1',
        orgId: 'org-1',
        principalType: 'user',
        principalId: 'usr-1',
        scopeType: 'org',
        roleName: 'admin',
        createdAt: '2026-08-14T00:00:00Z',
      },
    ];
    const state = identitySlice.reducer(
      { ...initialState, status: 'loading' },
      identityActions.fetchAssignmentsSuccess(mockAssignments)
    );

    expect(state.status).toBe('succeeded');
    expect(state.assignments).toEqual(mockAssignments);
    expect(state.error).toBeNull();
  });

  it('records error on fetchAssignmentsFailure', () => {
    const state = identitySlice.reducer(
      { ...initialState, status: 'loading' },
      identityActions.fetchAssignmentsFailure('Failed to load')
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to load');
  });

  it('populates audit events on fetchAuditEventsSuccess', () => {
    const mockEvents: AuditEvent[] = [
      {
        id: 'ae-1',
        organizationId: 'org-1',
        actorType: 'user',
        action: 'ASSIGN_ROLE',
        resourceType: 'role_assignment',
        severity: 'info',
        prevHash: 'GENESIS',
        entryHash: 'abc123hash',
        occurredAt: '2026-08-14T10:00:00Z',
      },
    ];
    const state = identitySlice.reducer(
      { ...initialState, status: 'loading' },
      identityActions.fetchAuditEventsSuccess(mockEvents)
    );

    expect(state.status).toBe('succeeded');
    expect(state.auditEvents).toEqual(mockEvents);
  });
});
