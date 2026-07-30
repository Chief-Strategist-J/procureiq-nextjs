import { describe, it, expect } from "vitest"
import { apiLogin, apiSignup, apiForgotPassword, apiResetPassword, apiVerifyEmail } from "../../services/auth-api"

describe("auth-api client service", () => {
  it("apiLogin returns mock user data in preview fallback mode", async () => {
    const res = await apiLogin({ username: "john", password: "password123" })
    expect(res.user.name).toBe("john")
    expect(res.token).toBeDefined()
  })

  it("apiSignup creates user object", async () => {
    const res = await apiSignup({ username: "alice", email: "alice@procureiq.com", password: "secretpassword" })
    expect(res.name).toBe("alice")
    expect(res.email).toBe("alice@procureiq.com")
  })

  it("apiForgotPassword returns confirmation message", async () => {
    const res = await apiForgotPassword({ email: "user@procureiq.com" })
    expect(res.message).toBeDefined()
  })

  it("apiResetPassword completes reset request", async () => {
    const res = await apiResetPassword({ token: "token123", newPassword: "newpassword" })
    expect(res.message).toBeDefined()
  })

  it("apiVerifyEmail completes verification request", async () => {
    const res = await apiVerifyEmail({ email: "user@procureiq.com", token: "token123" })
    expect(res.message).toBeDefined()
  })
})
