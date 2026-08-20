package com.procureiq.springboot_app.features.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssignRoleRequest(
    @NotNull Long roleId,
    @NotBlank String principalType,
    @NotNull Long principalId,
    @NotBlank String scopeType,
    Long scopeId,
    Long expiresAfterSeconds
) {}
