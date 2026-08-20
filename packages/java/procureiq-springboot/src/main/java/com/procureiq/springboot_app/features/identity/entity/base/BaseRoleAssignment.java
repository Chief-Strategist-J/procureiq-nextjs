package com.procureiq.springboot_app.features.identity.entity.base;

import jakarta.persistence.*;
import java.time.Instant;

@MappedSuperclass
public abstract class BaseRoleAssignment {
    @Id
    private Long id;

    @Column(name = "principal_type", nullable = false)
    private String principalType;

    @Column(name = "principal_id", nullable = false)
    private Long principalId;

    @Column(name = "scope_type", nullable = false)
    private String scopeType = "org";

    @Column(name = "scope_id")
    private Long scopeId;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public BaseRoleAssignment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPrincipalType() { return principalType; }
    public void setPrincipalType(String principalType) { this.principalType = principalType; }
    public Long getPrincipalId() { return principalId; }
    public void setPrincipalId(Long principalId) { this.principalId = principalId; }
    public String getScopeType() { return scopeType; }
    public void setScopeType(String scopeType) { this.scopeType = scopeType; }
    public Long getScopeId() { return scopeId; }
    public void setScopeId(Long scopeId) { this.scopeId = scopeId; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
