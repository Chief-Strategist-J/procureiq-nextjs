const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6565';
export const API_BASE_URL = rawApiUrl.replace(/\/api\/v1\/?$/, '');

const rawPythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
export const PYTHON_AI_BASE_URL = rawPythonApiUrl.replace(/\/api\/v1\/?$/, '');

export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/api/v1/auth',
    LOGIN: '/api/v1/auth/login',
    SIGNUP: '/api/v1/auth/signup',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
  },
  TVM: {
    BASE: '/api/v1/tvm',
    CALCULATE: '/api/v1/tvm/calculate',
    TIMESFM_FORECAST: '/api/v1/tvm/timesfm-forecast',
  },
  TVM_AI: {
    BASE: '/api/v1/tvm-ai',
    FORECAST: '/api/v1/tvm-ai/forecast',
  },
  CA: {
    BASE: '/ca',
  }
} as const;
