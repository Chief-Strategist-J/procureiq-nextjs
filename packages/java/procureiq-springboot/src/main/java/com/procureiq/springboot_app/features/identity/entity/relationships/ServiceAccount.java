package com.procureiq.springboot_app.features.identity.entity.relationships;

import com.procureiq.springboot_app.features.identity.entity.base.BaseServiceAccount;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import jakarta.persistence.*;

@Entity
@Table(name = "service_accounts")
public class ServiceAccount extends BaseServiceAccount {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    public ServiceAccount() {}

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
}
