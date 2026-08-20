package com.procureiq.springboot_app.features.tenant.service;

import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import com.procureiq.springboot_app.features.tenant.relationship.TenantUserRelationship;
import com.procureiq.springboot_app.features.tenant.relationship.TenantUserRelationshipRepository;
import com.procureiq.springboot_app.features.tenant.repository.TenantRepository;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final TenantUserRelationshipRepository relationshipRepository;

    public TenantService(
            TenantRepository tenantRepository,
            TenantUserRelationshipRepository relationshipRepository) {
        this.tenantRepository = tenantRepository;
        this.relationshipRepository = relationshipRepository;
    }

    @Transactional
    public Tenant getOrCreateTenant(String slug, String companyName) {
        return AuthPipeline.of(slug)
            .map(this::normalizeSlug)
            .map(normalizedSlug -> tenantRepository.findBySlug(normalizedSlug)
                .orElseGet(() -> tenantRepository.save(Tenant.create(normalizedSlug, resolveDisplayName(companyName)))))
            .get();
    }

    @Transactional
    public TenantUserRelationship attachUserToTenant(Tenant tenant, User user, String roleInTenant) {
        return relationshipRepository.findByTenantAndUser(tenant, user)
            .orElseGet(() -> relationshipRepository.save(TenantUserRelationship.create(tenant, user, roleInTenant)));
    }

    private String normalizeSlug(String slug) {
        return Optional.ofNullable(slug)
            .map(String::trim)
            .map(s -> s.toLowerCase(Locale.ROOT))
            .filter(s -> !s.isEmpty())
            .orElse("default");
    }

    private String resolveDisplayName(String companyName) {
        return Optional.ofNullable(companyName)
            .map(String::trim)
            .filter(n -> !n.isEmpty())
            .orElse("Default Tenant");
    }
}
