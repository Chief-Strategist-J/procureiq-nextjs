import { ValidationResult, ValidationSchema } from './types';
import { LOGIN_SCHEMA, SIGNUP_SCHEMA, FORGOT_PASSWORD_SCHEMA } from './rules';

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

export class AuthValidator {
  public static validateLoginForm(input: { email: string; password: string }): ValidationResult {
    return validateSchema(input, LOGIN_SCHEMA);
  }

  public static validateSignupForm(input: {
    name: string;
    email: string;
    password: string;
    companyName: string;
    agreeToTerms: boolean;
  }): ValidationResult {
    return validateSchema(input, SIGNUP_SCHEMA);
  }

  public static validateForgotPasswordForm(email: string): ValidationResult {
    return validateSchema({ email }, FORGOT_PASSWORD_SCHEMA);
  }
}
