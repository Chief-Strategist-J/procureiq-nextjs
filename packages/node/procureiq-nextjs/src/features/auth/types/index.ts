export type UserRole = 'admin' | 'accountant' | 'chartered_accountant' | 'ca' | 'engineer' | 'user';

export interface UserProfile {
  id: string;
  tenantId?: string;
  email: string;
  name: string;
  role: UserRole;
  roles?: UserRole[];
  companyName?: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  role?: UserRole;
  rememberMe?: boolean;
}

export interface AdminRoleMetadata {
  adminClearanceLevel: string;
  authorizationGrantCode: string;
}

export interface AccountantRoleMetadata {
  cpaLicenseNumber: string;
  taxIdVat: string;
  financialAuthorityLimit: number;
  accountingFirmDept: string;
}

export interface EngineerRoleMetadata {
  engineeringLicenseNo: string;
  specialization: string;
  technicalDepartment: string;
  certificationBody: string;
}

export interface UserRoleMetadata {
  employeeId: string;
  department: string;
  purchasingLimit: number;
  reportingManagerEmail: string;
}

export type RoleMetadataMap = {
  admin: AdminRoleMetadata;
  accountant: AccountantRoleMetadata;
  engineer: EngineerRoleMetadata;
  user: UserRoleMetadata;
};

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
  tenantId?: string;
  role: UserRole;
  roles?: UserRole[];
  agreeToTerms: boolean;
  roleMetadata?: Record<string, string | number | boolean>;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
