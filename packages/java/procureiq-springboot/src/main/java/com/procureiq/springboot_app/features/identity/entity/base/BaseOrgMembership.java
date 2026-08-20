package com.procureiq.springboot_app.features.identity.entity.base;

import jakarta.persistence.*;
import java.time.Instant;

@MappedSuperclass
public abstract class BaseOrgMembership {
    @Id
    private Long id;

    @Column(nullable = false)
    private String status = "active";

    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt = Instant.now();

    public BaseOrgMembership() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}
