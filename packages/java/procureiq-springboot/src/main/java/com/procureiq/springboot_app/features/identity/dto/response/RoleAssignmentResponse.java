package com.procureiq.springboot_app.features.identity.dto.response;

import java.time.Instant;

public record RoleAssignmentResponse(
    Long id,
    Long orgId,
    Long roleId,
    String roleName,
    String principalType,
    Long principalId,
    String scopeType,
    Long scopeId,
    Instant expiresAt,
    Instant createdAt
) {}
