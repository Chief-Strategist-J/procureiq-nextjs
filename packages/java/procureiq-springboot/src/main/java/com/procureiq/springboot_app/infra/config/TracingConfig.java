package com.procureiq.springboot_app.infra.config;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.common.CompletableResultCode;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.data.SpanData;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collection;

@Configuration
public class TracingConfig {

    @Bean
    public io.opentelemetry.api.OpenTelemetry openTelemetry() {
        String otelDisabled = System.getenv("OTEL_SDK_DISABLED");
        if ("true".equalsIgnoreCase(otelDisabled)) {
            return io.opentelemetry.api.OpenTelemetry.noop();
        }

        SpanExporter loggingExporter = new SpanExporter() {
            @Override
            public CompletableResultCode export(Collection<SpanData> spans) {
                for (SpanData span : spans) {
                    System.out.printf("[TRACE] Span: %s, duration: %d ms, status: %s, attributes: %s%n",
                            span.getName(),
                            (span.getEndEpochNanos() - span.getStartEpochNanos()) / 1_000_000,
                            span.getStatus().getStatusCode(),
                            span.getAttributes().toString()
                    );
                }
                return CompletableResultCode.ofSuccess();
            }

            @Override
            public CompletableResultCode flush() {
                return CompletableResultCode.ofSuccess();
            }

            @Override
            public CompletableResultCode shutdown() {
                return CompletableResultCode.ofSuccess();
            }
        };

        Resource resource = Resource.getDefault()
                .toBuilder()
                .put("service.name", "springboot-app")
                .build();

        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
                .addSpanProcessor(BatchSpanProcessor.builder(loggingExporter).build())
                .setResource(resource)
                .build();

        try {
            return OpenTelemetrySdk.builder()
                    .setTracerProvider(tracerProvider)
                    .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
                    .buildAndRegisterGlobal();
        } catch (IllegalStateException e) {
            return GlobalOpenTelemetry.get();
        }
    }
}
