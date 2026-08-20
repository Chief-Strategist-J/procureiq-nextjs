package com.procureiq.springboot_app.features.tenant.relationship;

import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantUserRelationshipRepository extends JpaRepository<TenantUserRelationship, Long> {
    List<TenantUserRelationship> findByTenant(Tenant tenant);
    List<TenantUserRelationship> findByUser(User user);
    Optional<TenantUserRelationship> findByTenantAndUser(Tenant tenant, User user);
    boolean existsByTenantAndUser(Tenant tenant, User user);
}
