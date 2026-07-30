import { httpClient } from "../../services/http-client"

describe("HttpClient", () => {
  it("injects OpenTelemetry trace headers into requests", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { status: "ok" } }),
    })
    global.fetch = mockFetch as unknown as typeof fetch

    const data = await httpClient.get<{ status: string }>("http://localhost/test")

    expect(data.status).toBe("ok")
    expect(mockFetch).toHaveBeenCalled()
    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].headers).toHaveProperty("X-Trace-Id")
    expect(callArgs[1].headers).toHaveProperty("X-Span-Id")
  })
})
