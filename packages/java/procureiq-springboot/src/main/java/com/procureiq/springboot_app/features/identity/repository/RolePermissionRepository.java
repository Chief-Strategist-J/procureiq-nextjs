package com.procureiq.springboot_app.features.identity.repository;

import com.procureiq.springboot_app.features.identity.entity.relationships.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermission.RolePermissionId> {
    List<RolePermission> findByRoleIdIn(List<Long> roleIds);
}
