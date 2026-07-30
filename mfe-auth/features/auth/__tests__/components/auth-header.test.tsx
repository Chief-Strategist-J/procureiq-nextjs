import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { AuthHeader } from "../../components/auth-header"

describe("AuthHeader component", () => {
  it("renders default title, description, and port number", () => {
    render(<AuthHeader />)

    expect(screen.getByText("Identity & Access Roles")).toBeDefined()
    expect(screen.getByText("Manage user credentials, API keys, and track role assignments.")).toBeDefined()
    expect(screen.getByText("Access Port: 8992")).toBeDefined()
  })

  it("renders custom title and port number when passed as props", () => {
    render(<AuthHeader title="Custom Auth Console" port={9999} />)

    expect(screen.getByText("Custom Auth Console")).toBeDefined()
    expect(screen.getByText("Access Port: 9999")).toBeDefined()
  })
})
