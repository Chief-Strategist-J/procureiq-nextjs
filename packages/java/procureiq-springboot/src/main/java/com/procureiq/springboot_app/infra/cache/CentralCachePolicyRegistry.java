package com.procureiq.springboot_app.infra.cache;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CentralCachePolicyRegistry {

    private final Map<String, CachePolicy> policyMap = new ConcurrentHashMap<>();

    public CentralCachePolicyRegistry() {
        // Register default priority policies for endpoints
        registerPolicy(CacheConstants.CACHE_USER_ROLE_ASSIGNMENTS, CachePriority.P2_MEDIUM_VOLATILITY, 300);
        registerPolicy(CacheConstants.CACHE_USER_PROFILE, CachePriority.P2_MEDIUM_VOLATILITY, 300);
        registerPolicy(CacheConstants.CACHE_ORG_METADATA, CachePriority.P2_MEDIUM_VOLATILITY, 300);
        registerPolicy(CacheConstants.CACHE_ORG_AUDIT_EVENTS, CachePriority.P0_REALTIME, 0);
        registerPolicy(CacheConstants.CACHE_SECURITY_VERIFICATION, CachePriority.P0_REALTIME, 0);
        registerPolicy(CacheConstants.CACHE_SYSTEM_REFERENCE_DATA, CachePriority.P3_STATIC, 900);
    }

    public void registerPolicy(String cacheName, CachePriority priority, int ttlSeconds) {
        policyMap.put(cacheName.toLowerCase(), new CachePolicy(priority, ttlSeconds));
    }

    public CachePolicy getPolicy(String cacheName) {
        return policyMap.getOrDefault(cacheName.toLowerCase(), new CachePolicy(CachePriority.P2_MEDIUM_VOLATILITY, 300));
    }

    public static class CachePolicy {
        private final CachePriority priority;
        private final int ttlSeconds;

        public CachePolicy(CachePriority priority, int ttlSeconds) {
            this.priority = priority;
            this.ttlSeconds = ttlSeconds;
        }

        public CachePriority getPriority() {
            return priority;
        }

        public int getTtlSeconds() {
            return ttlSeconds;
        }

        public boolean isCacheable() {
            return priority.isCacheable();
        }
    }
}
