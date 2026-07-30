import { traceAuthAction } from "../../services/auth-tracing"

describe("auth-tracing service", () => {
  it("creates a valid AuthTraceEvent for api_key.generate", () => {
    const event = traceAuthAction("api_key.generate", { keyPrefix: "pk_live_" })

    expect(event).toHaveProperty("traceId")
    expect(event).toHaveProperty("spanId")
    expect(event.service).toBe("mfe-auth")
    expect(event.action).toBe("api_key.generate")
    expect(event.attributes["keyPrefix"]).toBe("pk_live_")
  })
})
