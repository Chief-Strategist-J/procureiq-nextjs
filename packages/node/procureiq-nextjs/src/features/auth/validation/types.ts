export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationRule<T> {
  field: keyof T | string;
  test: (value: unknown, form: T) => boolean;
  message: string;
}

export type ValidationSchema<T> = ValidationRule<T>[];
