package com.procureiq.springboot_app.shared.tenant;

import java.util.Locale;
import java.util.Optional;

public final class TenantContext {

    private static final String DEFAULT_TENANT_ID = "default";
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static void setTenantId(String tenantId) {
        CURRENT_TENANT.set(Optional.ofNullable(tenantId)
            .map(String::trim)
            .map(t -> t.toLowerCase(Locale.ROOT))
            .filter(t -> !t.isEmpty())
            .orElse(DEFAULT_TENANT_ID));
    }

    public static String getTenantId() {
        return Optional.ofNullable(CURRENT_TENANT.get())
            .map(t -> t.toLowerCase(Locale.ROOT))
            .orElse(DEFAULT_TENANT_ID);
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
