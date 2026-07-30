import { apiLogin, apiSignup, apiVerifyEmail } from "../../services/auth-api"

describe("auth-api client service", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error("Network Error")))
  })

  it("apiLogin returns mock user data in preview fallback mode", async () => {
    const res = await apiLogin({ username: "john", password: "password123" })
    expect(res.user.name).toBe("john")
    expect(res.token).toBeDefined()
  })

  it("apiSignup returns mock account creation payload", async () => {
    const res = await apiSignup({ username: "jane", email: "jane@procureiq.com", password: "password123" })
    expect(res.name).toBe("jane")
    expect(res.email).toBe("jane@procureiq.com")
  })

  it("apiVerifyEmail handles email verification request", async () => {
    const res = await apiVerifyEmail({ email: "jane@procureiq.com", token: "tok_123" })
    expect(res.message).toContain("verified")
  })
})
