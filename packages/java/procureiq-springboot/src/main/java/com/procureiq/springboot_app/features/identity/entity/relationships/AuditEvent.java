package com.procureiq.springboot_app.features.identity.entity.relationships;

import com.procureiq.springboot_app.features.identity.entity.base.BaseAuditEvent;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import jakarta.persistence.*;

@Entity
@Table(name = "audit_events")
public class AuditEvent extends BaseAuditEvent {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    public AuditEvent() {}

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
}
