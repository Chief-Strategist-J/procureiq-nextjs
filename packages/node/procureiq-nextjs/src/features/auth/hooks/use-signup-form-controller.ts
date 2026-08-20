import React from 'react';
import { SignupInput, UserRole } from '../types';
import { useAuthManagement } from './use-auth-management';
import {
  resolveActiveRoleFields,
  transformSignupFormToApiPayload,
} from '../transforms/auth.viewmodel';

export function useSignupFormController(onSubmitProp?: (data: SignupInput) => void) {
  const {
    signupForm,
    fieldErrors,
    dialog,
    isLoading,
    updateSignupForm,
    toggleSignupPasswordVisibility,
    closeDialog,
    submitSignupForm,
  } = useAuthManagement();

  const { name, email, password, showPassword, companyName, tenantId, role, roles = [role], agreeToTerms, roleMetadata } = signupForm;

  const handleMetadataChange = (key: string, value: string | number) => {
    updateSignupForm({
      roleMetadata: {
        ...roleMetadata,
        [key]: value,
      },
    });
  };

  const toggleRoleSelection = (selectedRole: UserRole) => {
    const activeRoles = roles.includes(selectedRole)
      ? roles.filter((r) => r !== selectedRole)
      : [...roles, selectedRole];

    const finalRoles = activeRoles.length > 0 ? activeRoles : [selectedRole];
    updateSignupForm({
      role: finalRoles[0],
      roles: finalRoles,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const payload = transformSignupFormToApiPayload(signupForm, roles);
    if (onSubmitProp) {
      onSubmitProp(payload);
    } else {
      submitSignupForm(payload);
    }
  };

  const activeFields = resolveActiveRoleFields(roles);

  return {
    name,
    email,
    password,
    showPassword,
    companyName,
    tenantId,
    role,
    roles,
    agreeToTerms,
    roleMetadata,
    fieldErrors,
    dialog,
    isLoading,
    activeFields,
    updateSignupForm,
    handleMetadataChange,
    toggleRoleSelection,
    toggleSignupPasswordVisibility,
    closeDialog,
    handleSubmit,
  };
}
