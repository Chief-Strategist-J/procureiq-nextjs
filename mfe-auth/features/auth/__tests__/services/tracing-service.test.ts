import { describe, it, expect } from "vitest"
import { tracingService } from "../../services/tracing-service"

describe("TracingService", () => {
  it("generates a valid OpenTelemetry trace event", () => {
    const trace = tracingService.createTrace("test_action", { env: "test" })

    expect(trace).toHaveProperty("traceId")
    expect(trace).toHaveProperty("spanId")
    expect(trace.service).toBe("mfe-auth")
    expect(trace.action).toBe("test_action")
    expect(trace.attributes["env"]).toBe("test")
  })
})
