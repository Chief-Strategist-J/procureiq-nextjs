import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { EmailVerificationCard } from "../../components/email-verification-card"
import { AUTH_STRINGS } from "../../constants/auth-strings"

describe("EmailVerificationCard component", () => {
  it("submits email verification request", () => {
    const handleVerify = jest.fn()
    render(<EmailVerificationCard onVerify={handleVerify} />)

    fireEvent.change(screen.getByLabelText(AUTH_STRINGS.VERIFY_EMAIL.LABEL_EMAIL), { target: { value: "verify@procureiq.com" } })
    fireEvent.change(screen.getByLabelText(AUTH_STRINGS.VERIFY_EMAIL.LABEL_TOKEN), { target: { value: "token_123" } })
    fireEvent.click(screen.getByRole("button", { name: AUTH_STRINGS.VERIFY_EMAIL.SUBMIT_BTN }))

    expect(handleVerify).toHaveBeenCalledWith({
      email: "verify@procureiq.com",
      token: "token_123",
    })
  })
})
