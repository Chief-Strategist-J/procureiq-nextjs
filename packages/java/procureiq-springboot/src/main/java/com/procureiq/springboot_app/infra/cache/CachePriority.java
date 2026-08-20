package com.procureiq.springboot_app.infra.cache;

public enum CachePriority {
    P0_REALTIME(0, 0, false),          // Priority 0: Real-time, bypass cache
    P1_HIGH_VOLATILITY(1, 60, true),    // Priority 1: High frequency, 60s TTL
    P2_MEDIUM_VOLATILITY(2, 300, true),  // Priority 2: Moderate frequency, 300s (5m) TTL
    P3_STATIC(3, 900, true);            // Priority 3: Low volatility, 900s (15m) TTL

    private final int level;
    private final int defaultTtlSeconds;
    private final boolean cacheable;

    CachePriority(int level, int defaultTtlSeconds, boolean cacheable) {
        this.level = level;
        this.defaultTtlSeconds = defaultTtlSeconds;
        this.cacheable = cacheable;
    }

    public int getLevel() {
        return level;
    }

    public int getDefaultTtlSeconds() {
        return defaultTtlSeconds;
    }

    public boolean isCacheable() {
        return cacheable;
    }
}
