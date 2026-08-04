export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class AuthValidator {
  public static validateEmail(email: string): string | null {
    if (!email || !email.trim()) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Invalid email address format (e.g. user@domain.com).';
    }
    return null;
  }

  public static validateUsername(username: string): string | null {
    if (!username || !username.trim()) {
      return 'Username is required.';
    }
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 50) {
      return 'Username must be between 3 and 50 characters';
    }
    return null;
  }

  public static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return null;
  }

  public static validateLoginForm(email: string, password: string): ValidationResult {
    const errors: Record<string, string> = {};

    const isEmail = email.includes('@');
    if (isEmail) {
      const emailErr = this.validateEmail(email);
      if (emailErr) errors.email = emailErr;
    } else {
      const userErr = this.validateUsername(email);
      if (userErr) errors.email = userErr;
    }

    const passErr = this.validatePassword(password);
    if (passErr) errors.password = passErr;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  public static validateSignupForm(
    name: string,
    email: string,
    password: string,
    companyName: string,
    agreeToTerms: boolean
  ): ValidationResult {
    const errors: Record<string, string> = {};

    const nameErr = this.validateUsername(name);
    if (nameErr) errors.name = nameErr;

    const emailErr = this.validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const passErr = this.validatePassword(password);
    if (passErr) errors.password = passErr;

    if (companyName && companyName.trim().length < 2) {
      errors.companyName = 'Company name must be at least 2 characters.';
    }

    if (!agreeToTerms) {
      errors.agreeToTerms = 'You must accept the terms of service to proceed.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  public static validateForgotPasswordForm(email: string): ValidationResult {
    const errors: Record<string, string> = {};
    const emailErr = this.validateEmail(email);
    if (emailErr) errors.email = emailErr;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
