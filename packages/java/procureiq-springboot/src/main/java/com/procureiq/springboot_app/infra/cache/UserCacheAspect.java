package com.procureiq.springboot_app.infra.cache;

import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
public class UserCacheAspect {

    private static final Logger log = LoggerFactory.getLogger(UserCacheAspect.class);

    private final CentralCachePolicyRegistry policyRegistry;
    private final RedisTemplate<String, Object> redisTemplate;
    
    // Level 1 In-Memory Cache (0ms JVM cache)
    private final Map<String, CacheEntry> l1MemoryCache = new ConcurrentHashMap<>();

    public UserCacheAspect(CentralCachePolicyRegistry policyRegistry, RedisTemplate<String, Object> redisTemplate) {
        this.policyRegistry = policyRegistry;
        this.redisTemplate = redisTemplate;
    }

    @Around("@annotation(userCacheable)")
    public Object handleUserCacheable(ProceedingJoinPoint joinPoint, UserCacheable userCacheable) throws Throwable {
        String cacheName = userCacheable.name();
        CentralCachePolicyRegistry.CachePolicy policy = policyRegistry.getPolicy(cacheName);
        HttpServletResponse response = getHttpResponse();

        // 1. Check Data-Path Hotness / Priority
        if (!policy.isCacheable() || policy.getPriority() == CachePriority.P0_REALTIME) {
            setHeader(response, "X-Cache-Status", "BYPASS");
            return joinPoint.proceed();
        }

        int ttlSeconds = userCacheable.ttlSeconds() > 0 ? userCacheable.ttlSeconds() : policy.getTtlSeconds();
        String contextKey = resolveUserContextKey(joinPoint, cacheName);
        String cancelKey = "tag:" + cacheName;

        setHeader(response, "X-Cache-Cancel-Key", cancelKey);
        setHeader(response, "X-Cache-Key", contextKey);

        long now = System.currentTimeMillis();

        // 2. Check Level 1 (JVM In-Memory Cache)
        CacheEntry l1Entry = l1MemoryCache.get(contextKey);
        if (l1Entry != null && l1Entry.expiryTime > now) {
            setHeader(response, "X-Cache-Status", "HIT_L1");
            return l1Entry.value;
        }

        // 3. Check Level 3 (Redis Cache with Fallback)
        try {
            Object redisVal = redisTemplate.opsForValue().get(contextKey);
            if (redisVal != null) {
                l1MemoryCache.put(contextKey, new CacheEntry(redisVal, now + (ttlSeconds * 1000L)));
                setHeader(response, "X-Cache-Status", "HIT_L3_REDIS");
                return redisVal;
            }
        } catch (Exception e) {
            log.warn("Redis lookup failed for key {}. Falling back to L1/DB: {}", contextKey, e.getMessage());
        }

        // 4. Cache Miss - Proceed to Target Execution
        setHeader(response, "X-Cache-Status", "MISS");
        Object result = joinPoint.proceed();

        if (result != null) {
            long expiryTime = now + (ttlSeconds * 1000L);
            l1MemoryCache.put(contextKey, new CacheEntry(result, expiryTime));
            
            try {
                redisTemplate.opsForValue().set(contextKey, result, ttlSeconds, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.warn("Redis write failed for key {}: {}", contextKey, e.getMessage());
            }
        }

        return result;
    }

    @Around("@annotation(userCacheEvict)")
    public Object handleUserCacheEvict(ProceedingJoinPoint joinPoint, UserCacheEvict userCacheEvict) throws Throwable {
        Object result = joinPoint.proceed();
        String cacheName = userCacheEvict.name();
        String cancelKey = "tag:" + cacheName;
        HttpServletResponse response = getHttpResponse();

        setHeader(response, "X-Cache-Evicted-Keys", cacheName);
        setHeader(response, "X-Cache-Cancel-Key", cancelKey);

        // Evict matching entries from L1
        l1MemoryCache.keySet().removeIf(k -> k.contains(":" + cacheName + ":"));

        // Evict matching entries from Redis
        try {
            Set<String> keys = redisTemplate.keys("cache:*:" + cacheName + ":*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            log.warn("Redis eviction failed for cacheName {}: {}", cacheName, e.getMessage());
        }

        return result;
    }

    private String resolveUserContextKey(ProceedingJoinPoint joinPoint, String cacheName) {
        String userId = "anonymous";
        String tenantId = "default";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
            userId = auth.getName();
        }

        String argsHash = hashArgs(joinPoint.getArgs());
        return String.format("cache:%s:%s:%s:%s", tenantId, userId, cacheName, argsHash);
    }

    private String hashArgs(Object[] args) {
        if (args == null || args.length == 0) return "none";
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(Arrays.toString(args).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).substring(0, 12);
        } catch (Exception e) {
            return String.valueOf(Arrays.hashCode(args));
        }
    }

    private HttpServletResponse getHttpResponse() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getResponse() : null;
    }

    private void setHeader(HttpServletResponse response, String header, String value) {
        if (response != null) {
            response.setHeader(header, value);
        }
    }

    private static class CacheEntry {
        final Object value;
        final long expiryTime;

        CacheEntry(Object value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }
    }
}
