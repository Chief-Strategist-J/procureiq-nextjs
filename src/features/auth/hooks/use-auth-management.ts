import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { authActions } from '../store/auth-slice';
import { LoginInput, SignupInput } from '../types';
import { AUTH_STATUS } from '../constants';

export function useAuthManagement() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const loginForm = useAppSelector((state) => state.auth.loginForm ?? { email: '', password: '', showPassword: false });
  const signupForm = useAppSelector((state) => state.auth.signupForm ?? { name: '', email: '', password: '', showPassword: false, companyName: '', agreeToTerms: false });
  const fieldErrors = useAppSelector((state) => state.auth.fieldErrors ?? {});
  const dialog = useAppSelector((state) => state.auth.dialog ?? { isOpen: false, message: '' });

  const updateLoginForm = (fields: Partial<typeof loginForm>) => {
    dispatch(authActions.updateLoginForm(fields));
  };

  const toggleLoginPasswordVisibility = () => {
    dispatch(authActions.toggleLoginPasswordVisibility());
  };

  const updateSignupForm = (fields: Partial<typeof signupForm>) => {
    dispatch(authActions.updateSignupForm(fields));
  };

  const toggleSignupPasswordVisibility = () => {
    dispatch(authActions.toggleSignupPasswordVisibility());
  };

  const closeDialog = () => {
    dispatch(authActions.closeDialog());
  };

  const submitLoginForm = (input: LoginInput, customSubmit?: (data: LoginInput) => void) => {
    dispatch(authActions.submitLoginForm({ input, customSubmit }));
  };

  const submitSignupForm = (input: SignupInput, customSubmit?: (data: SignupInput) => void) => {
    dispatch(authActions.submitSignupForm({ input, customSubmit }));
  };

  const login = (input: LoginInput) => {
    dispatch(authActions.loginRequest(input));
  };

  const signup = (input: SignupInput) => {
    dispatch(authActions.signupRequest(input));
  };

  const setValidationErrors = (payload: { errors: Record<string, string>; message: string }) => {
    dispatch(authActions.setValidationErrors(payload));
  };

  const logout = () => {
    dispatch(authActions.logout());
  };

  const resetStatus = () => {
    dispatch(authActions.resetAuthStatus());
  };

  return {
    user,
    isAuthenticated,
    status,
    isLoading: status === AUTH_STATUS.LOADING,
    error,
    loginForm,
    signupForm,
    fieldErrors,
    dialog,
    updateLoginForm,
    toggleLoginPasswordVisibility,
    updateSignupForm,
    toggleSignupPasswordVisibility,
    closeDialog,
    setValidationErrors,
    submitLoginForm,
    submitSignupForm,
    login,
    signup,
    logout,
    resetStatus,
  };
}
