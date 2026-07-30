import { describe, it, expect } from "vitest"
import { traceAuthAction } from "../../services/auth-tracing"

describe("auth-tracing service", () => {
  it("creates a valid AuthTraceEvent for api_key.generate", () => {
    const event = traceAuthAction("api_key.generate", { keyPrefix: "pk_live_" })

    expect(event).toHaveProperty("traceId")
    expect(event).toHaveProperty("spanId")
    expect(event.action).toBe("api_key.generate")
    expect(event.eventName).toBe("auth.api_key.generate")
    expect(event.attributes["service.name"]).toBe("mfe-auth")
    expect(event.attributes["keyPrefix"]).toBe("pk_live_")
  })

  it("dispatches custom event to window when defined", () => {
    let capturedEvent: any = null
    const handler = (e: any) => {
      capturedEvent = e.detail
    }

    if (typeof window !== "undefined") {
      window.addEventListener("procureiq:auth:trace", handler)
    }

    const event = traceAuthAction("user.role_update", { userEmail: "test@procureiq.com" })

    if (typeof window !== "undefined") {
      expect(capturedEvent).not.toBeNull()
      expect(capturedEvent?.traceId).toBe(event.traceId)
      window.removeEventListener("procureiq:auth:trace", handler)
    }
  })
})
