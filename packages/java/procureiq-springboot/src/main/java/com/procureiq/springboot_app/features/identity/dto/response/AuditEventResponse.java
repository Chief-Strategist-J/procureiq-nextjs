package com.procureiq.springboot_app.features.identity.dto.response;

import java.time.Instant;

public record AuditEventResponse(
    Long id,
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
    String userAgent,
    String prevHash,
    String entryHash,
    Instant occurredAt
) {}
