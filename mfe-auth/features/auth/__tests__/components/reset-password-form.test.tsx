import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ResetPasswordForm } from "../../components/reset-password-form"

describe("ResetPasswordForm component", () => {
  it("submits new password payload", () => {
    const handleSubmit = vi.fn()
    render(<ResetPasswordForm onSubmit={handleSubmit} initialToken="mock_token_123" />)

    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpass123" } })
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }))

    expect(handleSubmit).toHaveBeenCalledWith({
      token: "mock_token_123",
      newPassword: "newpass123",
    })
  })
})
