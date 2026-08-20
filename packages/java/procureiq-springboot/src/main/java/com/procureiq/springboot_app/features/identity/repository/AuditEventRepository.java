package com.procureiq.springboot_app.features.identity.repository;

import com.procureiq.springboot_app.features.identity.entity.relationships.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {

    @Query(value = "SELECT * FROM audit_events WHERE org_id = :orgId ORDER BY occurred_at DESC, id DESC", nativeQuery = true)
    List<AuditEvent> findByOrgId(@Param("orgId") Long orgId);

    @Query(value = "SELECT * FROM audit_events WHERE org_id = :orgId ORDER BY occurred_at ASC, id ASC", nativeQuery = true)
    List<AuditEvent> findByOrgIdAscending(@Param("orgId") Long orgId);

    @Query(value = "SELECT * FROM audit_events WHERE org_id = :orgId ORDER BY occurred_at DESC, id DESC LIMIT 1", nativeQuery = true)
    List<AuditEvent> findLatestByOrgId(@Param("orgId") Long orgId);
}
