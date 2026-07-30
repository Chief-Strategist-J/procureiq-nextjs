import React from "react"
import { render, screen } from "@testing-library/react"
import { AuthHeader } from "../../components/auth-header"

describe("AuthHeader component", () => {
  it("renders default title, description, and port number", () => {
    render(<AuthHeader />)

    expect(screen.getByText("Identity & Access Roles")).toBeDefined()
    expect(screen.getByText(/8992/)).toBeDefined()
  })
})
