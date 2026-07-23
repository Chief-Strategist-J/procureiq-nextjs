import { trace } from '@opentelemetry/api';

export function getTracer(name = 'nextjs-app') {
  return trace.getTracer(name);
}
