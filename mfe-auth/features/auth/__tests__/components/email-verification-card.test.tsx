import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { EmailVerificationCard } from "../../components/email-verification-card"

describe("EmailVerificationCard component", () => {
  it("submits email verification request", () => {
    const handleVerify = vi.fn()
    render(<EmailVerificationCard onVerify={handleVerify} />)

    fireEvent.change(screen.getByLabelText("Account Email"), { target: { value: "verify@procureiq.com" } })
    fireEvent.change(screen.getByLabelText("Verification Token"), { target: { value: "token_999" } })
    fireEvent.click(screen.getByRole("button", { name: "Verify Account Email" }))

    expect(handleVerify).toHaveBeenCalledWith({
      email: "verify@procureiq.com",
      token: "token_999",
    })
  })
})
