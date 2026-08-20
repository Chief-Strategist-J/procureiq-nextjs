package com.procureiq.springboot_app.features.identity.repository;

import com.procureiq.springboot_app.features.identity.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByResourceTypeAndAction(String resourceType, String action);
}
