package com.procureiq.springboot_app.features.identity.entity.relationships;

import com.procureiq.springboot_app.features.identity.entity.base.BaseOrgMembership;
import com.procureiq.springboot_app.features.identity.entity.User;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import jakarta.persistence.*;

@Entity
@Table(name = "org_memberships")
public class OrgMembership extends BaseOrgMembership {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public OrgMembership() {}

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
