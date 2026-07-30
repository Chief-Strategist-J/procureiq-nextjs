import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LoginForm } from "../../components/login-form"

describe("LoginForm component", () => {
  it("renders username and password input fields and submit button", () => {
    render(<LoginForm onSubmit={() => {}} />)

    expect(screen.getByLabelText("Username or Email")).toBeDefined()
    expect(screen.getByLabelText("Password")).toBeDefined()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeDefined()
  })

  it("submits form with user inputs", () => {
    const handleSubmit = vi.fn()
    render(<LoginForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText("Username or Email"), { target: { value: "testuser" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass123" } })
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }))

    expect(handleSubmit).toHaveBeenCalledWith({
      username: "testuser",
      password: "pass123",
    })
  })
})
