package com.procureiq.springboot_app.features.identity.entity.base;

import jakarta.persistence.*;
import java.time.Instant;

@MappedSuperclass
public abstract class BaseRole {
    @Id
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "is_system_role", nullable = false)
    private Boolean isSystemRole = false;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public BaseRole() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsSystemRole() { return isSystemRole; }
    public void setIsSystemRole(Boolean systemRole) { isSystemRole = systemRole; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
