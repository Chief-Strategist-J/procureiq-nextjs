module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@shared/index$': '<rootDir>/shared/src/index.ts',
    '^@shared$': '<rootDir>/shared/src/index.ts',
    '^@shared/(.*)$': '<rootDir>/shared/src/$1',
  },
  testMatch: [
    '<rootDir>/mfe-auth/features/auth/__tests__/**/*.(test|spec).(ts|tsx)',
    '<rootDir>/shared/**/*.(test|spec).(ts|tsx)'
  ],
}
