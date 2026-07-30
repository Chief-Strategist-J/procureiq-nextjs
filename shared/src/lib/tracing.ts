"use client"

/**
 * OpenTelemetry and Web Vitals distributed tracing helper module for ProcureIQ Navigation.
 */

export interface TraceEvent {
  traceId: string
  spanId: string
  parentSpanId?: string
  eventName: string
  timestamp: number
  attributes: Record<string, string | number | boolean>
}

/**
 * Generates a standard trace or span ID (16-char hex).
 */
export function generateTraceId(): string {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
}

/**
 * Tracing function for recording navigation events with OpenTelemetry attributes.
 * 
 * @param targetPath The destination URL/path
 * @param sourcePath The current source URL/path
 * @param metadata Additional contextual tracing attributes
 * @returns TraceEvent details
 */
export function traceNavigation(
  targetPath: string,
  sourcePath: string = typeof window !== "undefined" ? window.location.pathname : "/",
  metadata: Record<string, string | number | boolean> = {}
): TraceEvent {
  const traceId = generateTraceId()
  const spanId = generateTraceId()
  const timestamp = Date.now()

  const traceEvent: TraceEvent = {
    traceId,
    spanId,
    eventName: "navigation.click",
    timestamp,
    attributes: {
      "http.target": targetPath,
      "http.route": targetPath,
      "http.user_agent": typeof navigator !== "undefined" ? navigator.userAgent : "server",
      "navigation.source": sourcePath,
      "navigation.destination": targetPath,
      "service.name": "procureiq-mfe-shell",
      ...metadata,
    },
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[OpenTelemetry Trace] [${traceEvent.traceId}] Navigation -> ${targetPath}`, traceEvent)
  }

  // Dispatch custom OpenTelemetry trace event to window for listeners / collectors
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("procureiq:trace", {
        detail: traceEvent,
      })
    )
  }

  return traceEvent
}
