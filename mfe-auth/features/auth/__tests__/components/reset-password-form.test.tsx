import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ResetPasswordForm } from "../../components/reset-password-form"
import { AUTH_STRINGS } from "../../constants/auth-strings"

describe("ResetPasswordForm component", () => {
  it("submits new password payload", () => {
    const handleSubmit = jest.fn()
    render(<ResetPasswordForm onSubmit={handleSubmit} initialToken="mock_token_123" />)

    fireEvent.change(screen.getByLabelText(AUTH_STRINGS.RESET_PASSWORD.LABEL_NEW_PASSWORD), { target: { value: "newpass123" } })
    fireEvent.click(screen.getByRole("button", { name: AUTH_STRINGS.RESET_PASSWORD.SUBMIT_BTN }))

    expect(handleSubmit).toHaveBeenCalledWith({
      token: "mock_token_123",
      newPassword: "newpass123",
    })
  })
})
