package com.procureiq.springboot_app.infra.config;

import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import java.util.concurrent.Callable;

public final class TracingHelper {
    private static final Tracer tracer = GlobalOpenTelemetry.getTracer("springboot-app", "1.0.0");

    private TracingHelper() {}

    @FunctionalInterface
    public interface ServiceBlock<T> {
        T execute() throws Exception;
    }

    @FunctionalInterface
    public interface ServiceVoidBlock {
        void execute() throws Exception;
    }

    public static ResponseEntity<?> executeWithTracing(final Callable<ResponseEntity<?>> block) {
        String spanName = "REST.Controller";
        try {
            final StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
            if (stackTrace.length > 2) {
                final StackTraceElement caller = stackTrace[2];
                final String className = caller.getClassName();
                final String simpleName = className.substring(className.lastIndexOf('.') + 1);
                spanName = "REST." + simpleName + "." + caller.getMethodName();
            }
        } catch (final Exception ignored) {}

        final Span span = tracer.spanBuilder(spanName)
            .setParent(io.opentelemetry.context.Context.current())
            .startSpan();
        try (final Scope scope = span.makeCurrent()) {
            final ResponseEntity<?> response = block.call();
            span.setStatus(StatusCode.OK);
            return response;
        } catch (final Exception e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, e.getMessage());
            var evaluated = ExceptionRuleEvaluator.evaluate(e);
            return ResponseEntity.status(evaluated.status())
                    .body(ApiSingleResponse.error(evaluated.status().value(), evaluated.userMessage()));
        } finally {
            span.end();
        }
    }

    public static <T> T executeServiceWithTracing(final ServiceBlock<T> block) {
        String spanName = "Service.Execution";
        try {
            final StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
            if (stackTrace.length > 2) {
                final StackTraceElement caller = stackTrace[2];
                final String className = caller.getClassName();
                final String simpleName = className.substring(className.lastIndexOf('.') + 1);
                spanName = "Service." + simpleName + "." + caller.getMethodName();
            }
        } catch (final Exception ignored) {}

        final Span span = tracer.spanBuilder(spanName)
            .setParent(io.opentelemetry.context.Context.current())
            .startSpan();
        try (final Scope scope = span.makeCurrent()) {
            final T result = block.execute();
            span.setStatus(StatusCode.OK);
            return result;
        } catch (final RuntimeException e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, e.getMessage());
            throw e;
        } catch (final Exception e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, e.getMessage());
            throw new RuntimeException(e);
        } finally {
            span.end();
        }
    }

    public static void executeServiceVoidWithTracing(final ServiceVoidBlock block) {
        executeServiceWithTracing(() -> {
            block.execute();
            return null;
        });
    }
}
