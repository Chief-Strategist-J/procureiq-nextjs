package com.procureiq.springboot_app.features.tenant.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug = "default";

    @Column(nullable = false)
    private String name = "Default Tenant";

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "settings_json", length = 4000)
    private String settingsJson = "{}";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Tenant() {}

    public Tenant(String slug, String name) {
        this.slug = Optional.ofNullable(slug)
            .map(String::trim)
            .map(s -> s.toLowerCase(Locale.ROOT))
            .filter(s -> !s.isEmpty())
            .orElse("default");
        this.name = Optional.ofNullable(name)
            .map(String::trim)
            .filter(n -> !n.isEmpty())
            .orElse("Default Tenant");
        this.status = "ACTIVE";
        this.settingsJson = "{}";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public static Tenant create(String slug, String name) {
        return new Tenant(slug, name);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlug() {
        return slug != null ? slug.toLowerCase(Locale.ROOT) : "default";
    }

    public void setSlug(String slug) {
        this.slug = Optional.ofNullable(slug)
            .map(String::trim)
            .map(s -> s.toLowerCase(Locale.ROOT))
            .filter(s -> !s.isEmpty())
            .orElse("default");
    }

    public String getName() {
        return name != null ? name : "Default Tenant";
    }

    public void setName(String name) {
        this.name = Optional.ofNullable(name)
            .map(String::trim)
            .filter(n -> !n.isEmpty())
            .orElse("Default Tenant");
    }

    public String getStatus() {
        return status != null ? status : "ACTIVE";
    }

    public void setStatus(String status) {
        this.status = status != null ? status : "ACTIVE";
    }

    public String getSettingsJson() {
        return settingsJson != null ? settingsJson : "{}";
    }

    public void setSettingsJson(String settingsJson) {
        this.settingsJson = settingsJson != null ? settingsJson : "{}";
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
