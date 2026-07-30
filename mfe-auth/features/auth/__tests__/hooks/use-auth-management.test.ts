import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAuthManagement } from "../../hooks/use-auth-management"

describe("useAuthManagement hook", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("initializes with default user list and empty API key state", () => {
    const { result } = renderHook(() => useAuthManagement())

    expect(result.current.users.length).toBe(3)
    expect(result.current.apiKey).toBe("")
    expect(result.current.generating).toBe(false)
  })

  it("generates a new API key after async delay", () => {
    const { result } = renderHook(() => useAuthManagement())

    act(() => {
      result.current.handleGenerateKey()
    })

    expect(result.current.generating).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(result.current.generating).toBe(false)
    expect(result.current.apiKey).toMatch(/^pk_live_/)
  })

  it("toggles user status correctly", () => {
    const { result } = renderHook(() => useAuthManagement())

    const initialStatus = result.current.users[0].status
    const targetEmail = result.current.users[0].email

    act(() => {
      result.current.toggleUserStatus(targetEmail)
    })

    const updatedUser = result.current.users.find((u) => u.email === targetEmail)
    expect(updatedUser?.status).not.toBe(initialStatus)
  })
})
