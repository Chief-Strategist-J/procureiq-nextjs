export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/auth"

export const AUTH_ENDPOINTS = {
  BASE: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/verify-email`,
} as const
