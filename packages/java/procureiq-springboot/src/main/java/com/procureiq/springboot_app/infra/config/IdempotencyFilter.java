package com.procureiq.springboot_app.infra.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.Map;

@Component
public class IdempotencyFilter implements Filter {

    private static final String IDEMPOTENCY_KEY_HEADER = "X-Idempotency-Key";
    private static final Map<String, CacheEntry> IDEMPOTENCY_CACHE = new java.util.concurrent.ConcurrentHashMap<>();

    private static class CacheEntry {
        final int statusCode;
        final byte[] responseBody;
        final String contentType;
        final long timestamp;

        CacheEntry(int statusCode, byte[] responseBody, String contentType) {
            this.statusCode = statusCode;
            this.responseBody = responseBody;
            this.contentType = contentType;
            this.timestamp = System.currentTimeMillis();
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!(request instanceof HttpServletRequest httpRequest) || !(response instanceof HttpServletResponse httpResponse)) {
            chain.doFilter(request, response);
            return;
        }

        String method = httpRequest.getMethod();
        String idempotencyKey = getIdempotencyKey(httpRequest);

        // Only enforce idempotency on state-mutating requests (POST, PUT, DELETE, PATCH) with key provided
        if (idempotencyKey == null || idempotencyKey.isBlank() || "GET".equalsIgnoreCase(method) || "HEAD".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        String tenantId = TenantContext.getCurrentTenant();
        String cacheKey = tenantId + ":" + idempotencyKey;

        // Check if idempotency key has already been executed
        CacheEntry cached = IDEMPOTENCY_CACHE.get(cacheKey);
        if (cached != null) {
            httpResponse.setStatus(cached.statusCode);
            if (cached.contentType != null) {
                httpResponse.setContentType(cached.contentType);
            }
            httpResponse.setHeader("Idempotency-Key", idempotencyKey);
            httpResponse.setHeader("X-Idempotency-Key", idempotencyKey);
            httpResponse.setHeader("X-Cache-Lookup", "HIT-IDEMPOTENT");
            httpResponse.getOutputStream().write(cached.responseBody);
            return;
        }

        // Cache wrapper to capture response body for future retries
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(httpResponse);
        chain.doFilter(request, responseWrapper);

        byte[] responseArray = responseWrapper.getContentAsByteArray();
        int status = responseWrapper.getStatus();

        // Store response in idempotency cache if request succeeded or yielded deterministic business output
        if (status >= 200 && status < 500) {
            IDEMPOTENCY_CACHE.put(cacheKey, new CacheEntry(status, responseArray, responseWrapper.getContentType()));
        }

        httpResponse.setHeader("Idempotency-Key", idempotencyKey);
        httpResponse.setHeader("X-Idempotency-Key", idempotencyKey);
        responseWrapper.copyBodyToResponse();
    }

    private String getIdempotencyKey(HttpServletRequest request) {
        String key = request.getHeader("Idempotency-Key");
        if (key == null || key.isBlank()) {
            key = request.getHeader("X-Idempotency-Key");
        }
        if (key == null || key.isBlank()) {
            key = request.getHeader("idempotency-key");
        }
        return key;
    }
}
