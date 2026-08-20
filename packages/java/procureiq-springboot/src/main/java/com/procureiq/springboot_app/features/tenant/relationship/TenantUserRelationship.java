package com.procureiq.springboot_app.features.tenant.relationship;

import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "tenant_user_relationships", uniqueConstraints = {
    @UniqueConstraint(name = "uk_tenant_user_rel", columnNames = {"tenant_slug", "user_id"})
})
public class TenantUserRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_slug", referencedColumnName = "slug", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "role_in_tenant", nullable = false)
    private String roleInTenant = "user";

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public TenantUserRelationship() {}

    public TenantUserRelationship(Tenant tenant, User user, String roleInTenant) {
        this.tenant = Objects.requireNonNull(tenant, "Tenant cannot be null");
        this.user = Objects.requireNonNull(user, "User cannot be null");
        this.roleInTenant = roleInTenant != null ? roleInTenant : "user";
        this.status = "ACTIVE";
        this.joinedAt = LocalDateTime.now();
    }

    public static TenantUserRelationship create(Tenant tenant, User user, String roleInTenant) {
        return new TenantUserRelationship(tenant, user, roleInTenant);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRoleInTenant() {
        return roleInTenant != null ? roleInTenant : "user";
    }

    public void setRoleInTenant(String roleInTenant) {
        this.roleInTenant = roleInTenant != null ? roleInTenant : "user";
    }

    public String getStatus() {
        return status != null ? status : "ACTIVE";
    }

    public void setStatus(String status) {
        this.status = status != null ? status : "ACTIVE";
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
