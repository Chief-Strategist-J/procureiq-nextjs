export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
      const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
      const { Resource } = await import('@opentelemetry/resources');
      const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');

      const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';

      const sdk = new NodeSDK({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'nextjs-app',
        }),
        traceExporter: new OTLPTraceExporter({
          url: otlpEndpoint,
        }),
        instrumentations: [
          getNodeAutoInstrumentations({
            // Let's disable fs instrumentation as it produces too much noise
            '@opentelemetry/instrumentation-fs': {
              enabled: false,
            },
          }),
        ],
      });

      sdk.start();
      console.log('OpenTelemetry successfully initialized for nextjs-app');
    } catch (error) {
      console.error('Error initializing OpenTelemetry:', error);
    }
  }
}
