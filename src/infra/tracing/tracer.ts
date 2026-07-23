import { trace, Span, SpanStatusCode } from '@opentelemetry/api';

const DEFAULT_SERVICE_NAME = 'procureiq-nextjs';

export function getTracer(serviceName = DEFAULT_SERVICE_NAME) {
  return trace.getTracer(serviceName);
}

/**
 * Universal OpenTelemetry helper for executing async functions inside a trace span.
 * Used across all feature modules to avoid duplicate tracing boilerplate.
 */
export async function withTraceSpan<T>(
  spanName: string,
  fn: (span: Span) => Promise<T>,
  attributes: Record<string, string | number | boolean> = {},
  serviceName = DEFAULT_SERVICE_NAME
): Promise<T> {
  const tracer = getTracer(serviceName);
  return tracer.startActiveSpan(spanName, async (span: Span) => {
    try {
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error?.message || 'Execution failed within trace span',
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
