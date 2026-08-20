package com.procureiq.springboot_app.infra.config;

public final class RequestContext {
    private static final ThreadLocal<RequestDetails> HOLDER = new ThreadLocal<>();

    public record RequestDetails(
            String traceId,
            String spanId,
            String correlationId,
            String requestId,
            String tenantId,
            String idempotencyKey,
            String sessionId
    ) {}

    private RequestContext() {}

    public static void set(RequestDetails details) {
        HOLDER.set(details);
        TenantContext.setCurrentTenant(details.tenantId());
    }

    public static RequestDetails get() {
        RequestDetails details = HOLDER.get();
        if (details == null) {
            return new RequestDetails("", "", "", "", TenantContext.getCurrentTenant(), "", "");
        }
        return details;
    }

    public static String getTraceId() { return get().traceId(); }
    public static String getSpanId() { return get().spanId(); }
    public static String getCorrelationId() { return get().correlationId(); }
    public static String getRequestId() { return get().requestId(); }
    public static String getTenantId() { return get().tenantId(); }
    public static String getIdempotencyKey() { return get().idempotencyKey(); }
    public static String getSessionId() { return get().sessionId(); }

    public static void clear() {
        HOLDER.remove();
        TenantContext.clear();
    }
}
