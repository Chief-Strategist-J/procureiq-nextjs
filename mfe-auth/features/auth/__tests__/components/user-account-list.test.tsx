import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { UserAccountList } from "../../components/user-account-list"
import { UserAccount } from "../../types"

const mockUsers: UserAccount[] = [
  { name: "John Doe", role: "Manager", email: "john@procureiq.com", status: "Active" },
  { name: "Jane Smith", role: "Auditor", email: "jane@procureiq.com", status: "Suspended" },
]

describe("UserAccountList component", () => {
  it("renders user details and status badges", () => {
    render(<UserAccountList users={mockUsers} />)

    expect(screen.getByText("John Doe")).toBeDefined()
    expect(screen.getByText("Jane Smith")).toBeDefined()
    expect(screen.getByText("Active")).toBeDefined()
    expect(screen.getByText("Suspended")).toBeDefined()
  })

  it("calls onToggleStatus when button is clicked", () => {
    const handleToggle = vi.fn()
    render(<UserAccountList users={mockUsers} onToggleStatus={handleToggle} />)

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])

    expect(handleToggle).toHaveBeenCalledWith("john@procureiq.com")
  })
})
