package com.procureiq.springboot_app.features.identity.entity.relationships;

import com.procureiq.springboot_app.features.identity.entity.base.BaseRole;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role extends BaseRole {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_role_id")
    private Role parentRole;

    public Role() {}

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public Role getParentRole() { return parentRole; }
    public void setParentRole(Role parentRole) { this.parentRole = parentRole; }
}
