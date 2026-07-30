import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { SignupForm } from "../../components/signup-form"

describe("SignupForm component", () => {
  it("renders all registration fields and submits form data", () => {
    const handleSubmit = vi.fn()
    render(<SignupForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "newuser" } })
    fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "new@procureiq.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } })
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "secret123" } })

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }))

    expect(handleSubmit).toHaveBeenCalledWith({
      username: "newuser",
      email: "new@procureiq.com",
      password: "secret123",
      confirmPassword: "secret123",
    })
  })
})
