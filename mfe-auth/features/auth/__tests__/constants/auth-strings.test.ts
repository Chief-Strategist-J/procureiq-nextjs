import { describe, it, expect } from "vitest"
import { AUTH_STRINGS } from "../../constants/auth-strings"
import { AUTH_ENDPOINTS } from "../../constants/auth-endpoints"

describe("AUTH_STRINGS and AUTH_ENDPOINTS constants", () => {
  it("contains valid string entries for form headers, inputs, and errors", () => {
    expect(AUTH_STRINGS.HEADER.DEFAULT_TITLE).toBe("Identity & Access Roles")
    expect(AUTH_STRINGS.LOGIN.TITLE).toBe("Platform Login")
    expect(AUTH_STRINGS.ERRORS.PASSWORD_MISMATCH).toBe("Passwords do not match.")
    expect(AUTH_STRINGS.SUCCESS.LOGIN_WELCOME).toBe("Welcome back! Authentication successful.")
  })

  it("contains valid URL endpoint paths", () => {
    expect(AUTH_ENDPOINTS.LOGIN).toContain("/login")
    expect(AUTH_ENDPOINTS.SIGNUP).toContain("/signup")
    expect(AUTH_ENDPOINTS.VERIFY_EMAIL).toContain("/verify-email")
  })
})
