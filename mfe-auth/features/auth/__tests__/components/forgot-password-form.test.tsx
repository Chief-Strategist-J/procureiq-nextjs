import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ForgotPasswordForm } from "../../components/forgot-password-form"

describe("ForgotPasswordForm component", () => {
  it("renders email field and submits reset request", () => {
    const handleSubmit = vi.fn()
    render(<ForgotPasswordForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText("Account Email"), { target: { value: "user@procureiq.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Link" }))

    expect(handleSubmit).toHaveBeenCalledWith({ email: "user@procureiq.com" })
  })
})
