package com.procureiq.springboot_app.infra.config;

import com.procureiq.springboot_app.shared.tenant.TenantContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Locale;
import java.util.Optional;

@Component
public class TenantInterceptor implements HandlerInterceptor {

    private static final String TENANT_HEADER = "X-Tenant-ID";
    private static final String TENANT_PARAM = "tenantId";
    private static final String TENANT_PARAM_SNAKE = "tenant_id";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = Optional.ofNullable(request.getHeader(TENANT_HEADER))
            .or(() -> Optional.ofNullable(request.getParameter(TENANT_PARAM)))
            .or(() -> Optional.ofNullable(request.getParameter(TENANT_PARAM_SNAKE)))
            .map(String::trim)
            .map(t -> t.toLowerCase(Locale.ROOT))
            .filter(t -> !t.isEmpty())
            .orElse("default");

        TenantContext.setTenantId(tenantId);
        io.opentelemetry.api.trace.Span.current().setAttribute("tenant.id", tenantId);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }
}
