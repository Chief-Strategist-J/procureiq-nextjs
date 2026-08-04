import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { authActions } from '../store/auth-slice';
import { LoginInput, SignupInput } from '../types';

export function useAuthManagement() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const login = (input: LoginInput) => {
    dispatch(authActions.loginRequest(input));
  };

  const signup = (input: SignupInput) => {
    dispatch(authActions.signupRequest(input));
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
    isLoading: status === 'loading',
    error,
    login,
    signup,
    logout,
    resetStatus,
  };
}
