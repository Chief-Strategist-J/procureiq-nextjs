export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const;

export const AUTH_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  GUEST: 'guest',
} as const;

export const AUTH_MESSAGES = {
  INVALID_EMAIL_FORMAT: 'Invalid email address format (e.g. user@domain.com).',
  INVALID_USERNAME_LENGTH: 'Username must be between 3 and 50 characters',
  INVALID_PASSWORD_LENGTH: 'Password must be at least 8 characters long.',
  INVALID_LOGIN_IDENTIFIER: 'Valid email format or username between 3 and 50 characters is required.',
  INVALID_COMPANY_NAME: 'Company name must be at least 2 characters if provided.',
  TERMS_REQUIRED: 'You must accept the terms of service to proceed.',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required.',
  SIGNUP_FIELDS_REQUIRED: 'Name, email, and password are required for signup.',
  ACCOUNT_LOCKED: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
  DEFAULT_ERROR: 'Authentication request failed. Please try again.',
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
} as const;
