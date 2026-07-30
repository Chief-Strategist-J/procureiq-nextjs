import React from "react"
import { render, screen } from "@testing-library/react"
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
    expect(screen.getByText(/john@procureiq\.com/)).toBeDefined()
  })
})
