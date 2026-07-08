// Next.js initializes OpenTelemetry automatically via the root /src/instrumentation.ts file.
// This directory serves as a place for custom trace spans and utility functions.
import { trace } from '@opentelemetry/api';

export function getTracer(name = 'nextjs-app') {
  return trace.getTracer(name);
}
