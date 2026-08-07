import { eventBus } from "../event-bus/event-bus";
import { TelemetryService } from "@/lib/telemetry";

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  status: "success" | "failure";
  details?: Record<string, any>;
  timestamp: string;
  traceId: string;
}

export const auditLogger = {
  log(entry: Omit<AuditLogEntry, "timestamp" | "traceId">) {
    const span = TelemetryService.createSpan(`audit-log:${entry.action}`);
    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      traceId: span.traceId,
    };

    console.log(`[AUDIT LOG] [${fullEntry.timestamp}] User: ${fullEntry.userId} | Action: ${fullEntry.action} | Resource: ${fullEntry.resource} | Status: ${fullEntry.status} | Trace: ${fullEntry.traceId}`, fullEntry.details);

    eventBus.emit("audit.log", fullEntry);
  }
};
