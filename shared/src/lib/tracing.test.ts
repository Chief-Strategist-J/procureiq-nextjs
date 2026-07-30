import { describe, it, expect, vi } from "vitest"
import { traceNavigation, generateTraceId } from "./tracing"

describe("tracing module", () => {
  it("generates a non-empty 16-character hex-like trace string", () => {
    const id = generateTraceId()
    expect(typeof id).toBe("string")
    expect(id.length).toBeGreaterThan(5)
  })

  it("creates a valid OpenTelemetry navigation TraceEvent", () => {
    const event = traceNavigation("/notifications", "/", { user_role: "admin" })
    
    expect(event).toHaveProperty("traceId")
    expect(event).toHaveProperty("spanId")
    expect(event.eventName).toBe("navigation.click")
    expect(event.attributes["http.target"]).toBe("/notifications")
    expect(event.attributes["navigation.destination"]).toBe("/notifications")
    expect(event.attributes["user_role"]).toBe("admin")
  })
})
