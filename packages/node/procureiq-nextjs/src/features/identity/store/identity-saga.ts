import { all, call, put, takeLatest, Effect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { identityActions } from './identity-slice';
import {
  fetchOrganizationsApi,
  fetchRoleAssignmentsApi,
  assignRoleApi,
  fetchAuditEventsApi,
  verifyAuditChainApi,
} from '../services/identity-api';
import type { Organization, RoleAssignment, AuditEvent, ChainVerificationResult, AssignRoleInput } from '../types';

export function* handleFetchOrganizations(): Generator<Effect, void, any> {
  try {
    const orgs: Organization[] = yield call(fetchOrganizationsApi);
    yield put(identityActions.fetchOrganizationsSuccess(orgs));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch organizations';
    yield put(identityActions.fetchOrganizationsFailure(msg));
  }
}

export function* handleFetchAssignments(
  action: PayloadAction<{ orgId: string; principalType?: string; principalId?: string }>
): Generator<Effect, void, any> {
  try {
    const { orgId, principalType, principalId } = action.payload;
    const assignments: RoleAssignment[] = yield call(fetchRoleAssignmentsApi, orgId, principalType, principalId);
    yield put(identityActions.fetchAssignmentsSuccess(assignments));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch role assignments';
    yield put(identityActions.fetchAssignmentsFailure(msg));
  }
}

export function* handleAssignRole(action: PayloadAction<AssignRoleInput>): Generator<Effect, void, any> {
  try {
    yield call(assignRoleApi, action.payload);
    yield put(identityActions.assignRoleSuccess());
    yield put(identityActions.fetchAssignmentsRequest({ orgId: action.payload.orgId }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to assign role';
    yield put(identityActions.assignRoleFailure(msg));
  }
}

export function* handleFetchAuditEvents(action: PayloadAction<string>): Generator<Effect, void, any> {
  try {
    const events: AuditEvent[] = yield call(fetchAuditEventsApi, action.payload);
    yield put(identityActions.fetchAuditEventsSuccess(events));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch audit events';
    yield put(identityActions.fetchAuditEventsFailure(msg));
  }
}

export function* handleVerifyAuditChain(action: PayloadAction<string>): Generator<Effect, void, any> {
  try {
    const result: ChainVerificationResult = yield call(verifyAuditChainApi, action.payload);
    yield put(identityActions.verifyAuditChainSuccess(result));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to verify audit chain integrity';
    yield put(identityActions.verifyAuditChainFailure(msg));
  }
}

export function* identitySaga(): Generator<Effect, void, void> {
  yield all([
    takeLatest(identityActions.fetchOrganizationsRequest.type, handleFetchOrganizations),
    takeLatest(identityActions.fetchAssignmentsRequest.type, handleFetchAssignments),
    takeLatest(identityActions.assignRoleRequest.type, handleAssignRole),
    takeLatest(identityActions.fetchAuditEventsRequest.type, handleFetchAuditEvents),
    takeLatest(identityActions.verifyAuditChainRequest.type, handleVerifyAuditChain),
  ]);
}
