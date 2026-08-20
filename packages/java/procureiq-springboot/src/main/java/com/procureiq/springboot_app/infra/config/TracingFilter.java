package com.procureiq.springboot_app.infra.config;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import io.opentelemetry.context.propagation.TextMapGetter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TracingFilter extends OncePerRequestFilter {

    private final Tracer tracer = GlobalOpenTelemetry.getTracer("springboot-app", "1.0.0");

    private static final TextMapGetter<HttpServletRequest> getter = new TextMapGetter<>() {
        @Override
        public Iterable<String> keys(HttpServletRequest carrier) {
            return Collections.list(carrier.getHeaderNames());
        }

        @Override
        public String get(HttpServletRequest carrier, String key) {
            return carrier != null ? carrier.getHeader(key) : null;
        }
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Context extractedContext = GlobalOpenTelemetry.getPropagators()
                .getTextMapPropagator()
                .extract(Context.current(), request, getter);

        String correlationId = getHeader(request, "X-Correlation-Id", "Correlation-ID");
        if (correlationId == null || correlationId.trim().isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }

        String requestId = getHeader(request, "X-Request-Id", "Request-ID");
        if (requestId == null || requestId.trim().isEmpty()) {
            requestId = "req-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        }

        String tenantId = getHeader(request, "X-Tenant-Id", "Tenant-ID");
        if (tenantId == null || tenantId.trim().isEmpty()) {
            tenantId = "default-tenant";
        }

        String idempotencyKey = getHeader(request, "Idempotency-Key", "X-Idempotency-Key", "idempotency-key");
        String sessionId = getHeader(request, "X-Session-Id", "Session-ID");
        if (sessionId == null) sessionId = "";

        String spanName = "HTTP " + request.getMethod() + " " + request.getRequestURI();

        Span span = tracer.spanBuilder(spanName)
                .setParent(extractedContext)
                .setAttribute("http.method", request.getMethod())
                .setAttribute("http.target", request.getRequestURI())
                .setAttribute("tenant.id", tenantId)
                .setAttribute("request.id", requestId)
                .setAttribute("correlation.id", correlationId)
                .startSpan();

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            span.setAttribute("idempotency.key", idempotencyKey);
            response.setHeader("Idempotency-Key", idempotencyKey);
        }

        if (!sessionId.isBlank()) {
            span.setAttribute("session.id", sessionId);
            response.setHeader("X-Session-Id", sessionId);
        }

        response.setHeader("X-Correlation-Id", correlationId);
        response.setHeader("X-Request-Id", requestId);
        response.setHeader("X-Tenant-Id", tenantId);
        response.setHeader("X-Trace-Id", span.getSpanContext().getTraceId());

        try (Scope scope = span.makeCurrent()) {
            RequestContext.set(new RequestContext.RequestDetails(
                    span.getSpanContext().getTraceId(),
                    span.getSpanContext().getSpanId(),
                    correlationId,
                    requestId,
                    tenantId,
                    idempotencyKey != null ? idempotencyKey : "",
                    sessionId
            ));

            MDC.put("trace_id", span.getSpanContext().getTraceId());
            MDC.put("span_id", span.getSpanContext().getSpanId());
            MDC.put("correlation_id", correlationId);
            MDC.put("request_id", requestId);
            MDC.put("tenant_id", tenantId);
            if (idempotencyKey != null) {
                MDC.put("idempotency_key", idempotencyKey);
            }
            if (!sessionId.isBlank()) {
                MDC.put("session_id", sessionId);
            }

            filterChain.doFilter(request, response);

            int status = response.getStatus();
            span.setAttribute("http.status_code", status);
            if (status >= 400) {
                span.setStatus(io.opentelemetry.api.trace.StatusCode.ERROR, "HTTP Status " + status);
            } else {
                span.setStatus(io.opentelemetry.api.trace.StatusCode.OK);
            }
        } catch (Exception ex) {
            span.recordException(ex);
            span.setStatus(io.opentelemetry.api.trace.StatusCode.ERROR, ex.getMessage());
            throw ex;
        } finally {
            MDC.remove("trace_id");
            MDC.remove("span_id");
            MDC.remove("correlation_id");
            MDC.remove("request_id");
            MDC.remove("tenant_id");
            MDC.remove("idempotency_key");
            MDC.remove("session_id");
            RequestContext.clear();
            span.end();
        }
    }

    private String getHeader(HttpServletRequest request, String... headerNames) {
        for (String headerName : headerNames) {
            String val = request.getHeader(headerName);
            if (val != null && !val.trim().isEmpty()) {
                return val;
            }
        }
        return null;
    }
}
