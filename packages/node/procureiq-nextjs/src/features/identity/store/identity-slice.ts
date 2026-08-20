import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_ORG_ID } from '../constants';
import type {
  IdentityState,
  Organization,
  RoleAssignment,
  AuditEvent,
  ChainVerificationResult,
  AssignRoleInput,
} from '../types';

const initialState: IdentityState = {
  organizations: [],
  assignments: [],
  auditEvents: [],
  verificationResult: null,
  status: 'idle',
  error: null,
  selectedOrgId: DEFAULT_ORG_ID,
};

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setSelectedOrgId(state, action: PayloadAction<string>) {
      state.selectedOrgId = action.payload;
    },
    fetchOrganizationsRequest(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchOrganizationsSuccess(state, action: PayloadAction<Organization[]>) {
      state.status = 'succeeded';
      state.organizations = action.payload;
      state.error = null;
      if (action.payload.length > 0 && !action.payload.some((o) => o.id === state.selectedOrgId)) {
        const defaultOrg = action.payload.find((o) => o.isDefault) ?? action.payload[0];
        state.selectedOrgId = defaultOrg.id;
      }
    },
    fetchOrganizationsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchAssignmentsRequest(
      state,
      _action: PayloadAction<{ orgId: string; principalType?: string; principalId?: string }>
    ) {
      state.status = 'loading';
      state.error = null;
    },
    fetchAssignmentsSuccess(state, action: PayloadAction<RoleAssignment[]>) {
      state.status = 'succeeded';
      state.assignments = action.payload;
      state.error = null;
    },
    fetchAssignmentsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    assignRoleRequest(state, _action: PayloadAction<AssignRoleInput>) {
      state.status = 'loading';
      state.error = null;
    },
    assignRoleSuccess(state) {
      state.status = 'succeeded';
      state.error = null;
    },
    assignRoleFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchAuditEventsRequest(state, _action: PayloadAction<string>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchAuditEventsSuccess(state, action: PayloadAction<AuditEvent[]>) {
      state.status = 'succeeded';
      state.auditEvents = action.payload;
      state.error = null;
    },
    fetchAuditEventsFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    verifyAuditChainRequest(state, _action: PayloadAction<string>) {
      state.status = 'loading';
      state.error = null;
    },
    verifyAuditChainSuccess(state, action: PayloadAction<ChainVerificationResult>) {
      state.status = 'succeeded';
      state.verificationResult = action.payload;
      state.error = null;
    },
    verifyAuditChainFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetIdentityStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const identityActions = identitySlice.actions;
