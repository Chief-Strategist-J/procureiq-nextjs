import { tracingService, CentralizedTraceEvent } from "./tracing-service"

export type AuthTraceEvent = CentralizedTraceEvent

export function traceAuthAction(
  action: string,
  metadata: Record<string, string | number | boolean> = {}
): AuthTraceEvent {
  return tracingService.createTrace(action, metadata)
}
