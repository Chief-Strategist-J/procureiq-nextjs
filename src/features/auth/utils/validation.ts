export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationRule<T> {
  field: keyof T;
  test: (value: any, form: T) => boolean;
  message: string;
}

export type ValidationSchema<T> = ValidationRule<T>[];

export function validateSchema<T extends Record<string, any>>(
  form: T,
  schema: ValidationSchema<T>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const rule of schema) {
    const fieldKey = String(rule.field);
    if (errors[fieldKey]) continue;

    const value = form[rule.field];
    if (!rule.test(value, form)) {
      errors[fieldKey] = rule.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const EMAIL_RULE: ValidationRule<any> = {
  field: 'email',
  test: (val) => Boolean(val && typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())),
  message: 'Invalid email address format (e.g. user@domain.com).',
};

export const USERNAME_RULE: ValidationRule<any> = {
  field: 'name',
  test: (val) => Boolean(val && typeof val === 'string' && val.trim().length >= 3 && val.trim().length <= 50),
  message: 'Username must be between 3 and 50 characters',
};

export const PASSWORD_RULE: ValidationRule<any> = {
  field: 'password',
  test: (val) => Boolean(val && typeof val === 'string' && val.length >= 8),
  message: 'Password must be at least 8 characters long.',
};

export const LOGIN_SCHEMA: ValidationSchema<any> = [
  {
    field: 'email',
    test: (val) => {
      if (!val || typeof val !== 'string') return false;
      const str = val.trim();
      return str.includes('@')
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
        : str.length >= 3 && str.length <= 50;
    },
    message: 'Valid email format or username between 3 and 50 characters is required.',
  },
  PASSWORD_RULE,
];

export const SIGNUP_SCHEMA: ValidationSchema<any> = [
  USERNAME_RULE,
  EMAIL_RULE,
  PASSWORD_RULE,
  {
    field: 'companyName',
    test: (val) => !val || (typeof val === 'string' && val.trim().length >= 2),
    message: 'Company name must be at least 2 characters if provided.',
  },
  {
    field: 'agreeToTerms',
    test: (val) => Boolean(val),
    message: 'You must accept the terms of service to proceed.',
  },
];

export const FORGOT_PASSWORD_SCHEMA: ValidationSchema<any> = [EMAIL_RULE];

export class AuthValidator {
  public static validateLoginForm(email: string, password: string): ValidationResult {
    return validateSchema({ email, password }, LOGIN_SCHEMA);
  }

  public static validateSignupForm(
    name: string,
    email: string,
    password: string,
    companyName: string,
    agreeToTerms: boolean
  ): ValidationResult {
    return validateSchema(
      { name, email, password, companyName, agreeToTerms },
      SIGNUP_SCHEMA
    );
  }

  public static validateForgotPasswordForm(email: string): ValidationResult {
    return validateSchema({ email }, FORGOT_PASSWORD_SCHEMA);
  }
}
