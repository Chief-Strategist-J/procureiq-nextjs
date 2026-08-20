import { ValidationRule, ValidationSchema } from './types';
import { AUTH_MESSAGES } from '../constants/index';

export const EMAIL_RULE: ValidationRule<unknown> = {
  field: 'email',
  test: (val) => Boolean(val && typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())),
  message: AUTH_MESSAGES.INVALID_EMAIL_FORMAT,
};

export const USERNAME_RULE: ValidationRule<unknown> = {
  field: 'name',
  test: (val) => Boolean(val && typeof val === 'string' && val.trim().length >= 3 && val.trim().length <= 50),
  message: AUTH_MESSAGES.INVALID_USERNAME_LENGTH,
};

export const PASSWORD_RULE: ValidationRule<unknown> = {
  field: 'password',
  test: (val) => Boolean(val && typeof val === 'string' && val.length >= 8),
  message: AUTH_MESSAGES.INVALID_PASSWORD_LENGTH,
};

export const LOGIN_SCHEMA: ValidationSchema<unknown> = [
  {
    field: 'email',
    test: (val) => {
      if (!val || typeof val !== 'string') return false;
      const str = val.trim();
      return str.includes('@')
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
        : str.length >= 3 && str.length <= 50;
    },
    message: AUTH_MESSAGES.INVALID_LOGIN_IDENTIFIER,
  },
  PASSWORD_RULE,
];

export const SIGNUP_SCHEMA: ValidationSchema<unknown> = [
  USERNAME_RULE,
  EMAIL_RULE,
  PASSWORD_RULE,
  {
    field: 'companyName',
    test: (val) => !val || (typeof val === 'string' && val.trim().length >= 2),
    message: AUTH_MESSAGES.INVALID_COMPANY_NAME,
  },
  {
    field: 'agreeToTerms',
    test: (val) => Boolean(val),
    message: AUTH_MESSAGES.TERMS_REQUIRED,
  },
];

export const FORGOT_PASSWORD_SCHEMA: ValidationSchema<unknown> = [EMAIL_RULE];
