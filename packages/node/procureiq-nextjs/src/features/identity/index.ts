export { RoleAssignmentList } from './components/role-assignment-list';
export { AssignRoleForm } from './components/assign-role-form';
export { AuditLogViewer } from './components/audit-log-viewer';
export { OrgSwitcher } from './components/org-switcher';

export { useIdentityManagement } from './hooks/use-identity-management';
export { identitySlice, identityActions } from './store/identity-slice';
export { identitySaga } from './store/identity-saga';
export { IDENTITY_ENDPOINTS, DEFAULT_ORG_ID } from './constants';

export type {
  Organization,
  RoleAssignment,
  AuditEvent,
  AssignRoleInput,
  ChainVerificationResult,
  IdentityState,
} from './types';

import { featureRegistry } from '@/core/store/feature-registry';
import { identitySlice } from './store/identity-slice';
import { identitySaga } from './store/identity-saga';

featureRegistry.register('identity', {
  reducer: identitySlice.reducer,
  saga: identitySaga,
});
