package com.procureiq.springboot_app.features.identity.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.procureiq.springboot_app.features.identity.entity.relationships.AuditEvent;
import com.procureiq.springboot_app.features.identity.repository.AuditEventRepository;
import com.procureiq.springboot_app.features.identity.dto.response.ChainVerificationResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AuditLogService {

    private final AuditEventRepository auditEventRepository;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public AuditLogService(
            AuditEventRepository auditEventRepository,
            JdbcTemplate jdbcTemplate,
            @org.springframework.lang.Nullable ObjectMapper objectMapper) {
        this.auditEventRepository = auditEventRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    @Transactional
    public void log(
            Long orgId,
            String actorType,
            Long actorId,
            String action,
            String resourceType,
            Long resourceId,
            String severity,
            String beforeValue,
            String afterValue,
            String requestId,
            String sessionId,
            String ipAddress,
            String userAgent) {

        try {
            List<AuditEvent> latest = auditEventRepository.findLatestByOrgId(orgId);
            String prevHash = latest.isEmpty() ? "0000000000000000000000000000000000000000000000000000000000000000" : latest.get(0).getEntryHash();

            Map<String, Object> dataMap = new TreeMap<>();
            dataMap.put("org_id", orgId);
            dataMap.put("actor_type", actorType);
            dataMap.put("actor_id", actorId);
            dataMap.put("action", action);
            dataMap.put("resource_type", resourceType);
            dataMap.put("resource_id", resourceId);
            dataMap.put("severity", severity);
            dataMap.put("before_value", parseJsonIfNeeded(beforeValue));
            dataMap.put("after_value", parseJsonIfNeeded(afterValue));
            dataMap.put("request_id", requestId);
            dataMap.put("session_id", sessionId);
            dataMap.put("ip_address", ipAddress);
            dataMap.put("user_agent", userAgent);

            String canonicalJson = objectMapper.writeValueAsString(dataMap);
            String rawContent = prevHash + ":" + canonicalJson;

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawContent.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String entryHash = hexString.toString();
            Long eventId = ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE);

            jdbcTemplate.update(
                "INSERT INTO audit_events (id, org_id, actor_type, actor_id, action, resource_type, resource_id, severity, before_value, after_value, request_id, session_id, ip_address, user_agent, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?::jsonb, ?, ?, ?::inet, ?, ?, ?)",
                eventId, orgId, actorType, actorId, action, resourceType, resourceId, severity, beforeValue, afterValue, requestId, sessionId, ipAddress, userAgent, prevHash, entryHash
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to write tamper-evident audit event log", e);
        }
    }

    @Transactional(readOnly = true)
    public List<AuditEvent> getLogs(Long orgId) {
        return auditEventRepository.findByOrgId(orgId);
    }

    @Transactional(readOnly = true)
    public ChainVerificationResult verifyChainIntegrity(Long orgId) {
        try {
            List<AuditEvent> events = auditEventRepository.findByOrgIdAscending(orgId);
            String expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

            for (AuditEvent event : events) {
                if (!event.getPrevHash().equals(expectedPrevHash)) {
                    return ChainVerificationResult.failure(event.getId(), event.getAction(), "Hash mismatch! Expected prevHash: " + expectedPrevHash + ", but found: " + event.getPrevHash());
                }

                Map<String, Object> dataMap = new TreeMap<>();
                dataMap.put("org_id", event.getOrganization() != null ? event.getOrganization().getId() : orgId);
                dataMap.put("actor_type", event.getActorType());
                dataMap.put("actor_id", event.getActorId());
                dataMap.put("action", event.getAction());
                dataMap.put("resource_type", event.getResourceType());
                dataMap.put("resource_id", event.getResourceId());
                dataMap.put("severity", event.getSeverity());
                dataMap.put("before_value", parseJsonIfNeeded(event.getBeforeValue()));
                dataMap.put("after_value", parseJsonIfNeeded(event.getAfterValue()));
                dataMap.put("request_id", event.getRequestId());
                dataMap.put("session_id", event.getSessionId());
                dataMap.put("ip_address", event.getIpAddress());
                dataMap.put("user_agent", event.getUserAgent());

                String canonicalJson = objectMapper.writeValueAsString(dataMap);
                String rawContent = expectedPrevHash + ":" + canonicalJson;

                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hashBytes = digest.digest(rawContent.getBytes(StandardCharsets.UTF_8));
                
                StringBuilder hexString = new StringBuilder();
                for (byte b : hashBytes) {
                    String hex = Integer.toHexString(0xff & b);
                    if (hex.length() == 1) hexString.append('0');
                    hexString.append(hex);
                }
                String computedHash = hexString.toString();

                if (!event.getEntryHash().equals(computedHash)) {
                    return ChainVerificationResult.failure(event.getId(), event.getAction(), "Entry hash mismatch! Computed: " + computedHash + ", but recorded: " + event.getEntryHash());
                }

                expectedPrevHash = computedHash;
            }
            return ChainVerificationResult.success();
        } catch (Exception e) {
            return ChainVerificationResult.failure(null, "VERIFICATION", "Crypto parsing error during verification: " + e.getMessage());
        }
    }

    private Object parseJsonIfNeeded(String jsonStr) {
        if (jsonStr == null || jsonStr.isBlank()) return null;
        try {
            return objectMapper.readValue(jsonStr, Object.class);
        } catch (Exception e) {
            return jsonStr;
        }
    }
}
