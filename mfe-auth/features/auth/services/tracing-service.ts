import { generateTraceId, TraceEvent } from "../../../../shared/src/lib/tracing"

export interface CentralizedTraceEvent extends TraceEvent {
  service: string
  action: string
}

export class TracingService {
  private static instance: TracingService
  private serviceName: string = "mfe-auth"

  private constructor() {}

  public static getInstance(): TracingService {
    if (!TracingService.instance) {
      TracingService.instance = new TracingService()
    }
    return TracingService.instance
  }

  public createTrace(
    action: string,
    attributes: Record<string, string | number | boolean> = {}
  ): CentralizedTraceEvent {
    const traceId = generateTraceId()
    const spanId = generateTraceId()
    const timestamp = Date.now()

    const event: CentralizedTraceEvent = {
      traceId,
      spanId,
      eventName: `procureiq.${this.serviceName}.${action}`,
      service: this.serviceName,
      action,
      timestamp,
      attributes: {
        "service.name": this.serviceName,
        "auth.action": action,
        "http.user_agent": typeof navigator !== "undefined" ? navigator.userAgent : "server",
        ...attributes,
      },
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Centralized Trace] [${event.traceId}] Action -> ${action}`, event)
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("procureiq:auth:trace", {
          detail: event,
        })
      )
    }

    return event
  }
}

export const tracingService = TracingService.getInstance()
