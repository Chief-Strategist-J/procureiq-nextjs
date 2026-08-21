package com.procureiq.springboot_app.features.tvm.repository;

import com.procureiq.springboot_app.features.tvm.entity.TvmForecastLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface TvmLedgerRepository extends JpaRepository<TvmForecastLedger, String> {

    Page<TvmForecastLedger> findByTenantIdOrderByCreatedAtDesc(String tenantId, Pageable pageable);

    Page<TvmForecastLedger> findByTenantIdAndCalculationTypeOrderByCreatedAtDesc(
        String tenantId,
        String calculationType,
        Pageable pageable
    );

    Optional<TvmForecastLedger> findByIdAndTenantId(String id, String tenantId);

    @Modifying
    @Query("UPDATE TvmForecastLedger l SET l.notes = :notes WHERE l.id = :id AND l.tenantId = :tenantId")
    int updateNotes(@Param("id") String id, @Param("tenantId") String tenantId, @Param("notes") String notes);

    @Modifying
    @Query("UPDATE TvmForecastLedger l SET l.exportedAt = :exportedAt WHERE l.id = :id AND l.tenantId = :tenantId")
    int markExported(@Param("id") String id, @Param("tenantId") String tenantId, @Param("exportedAt") OffsetDateTime exportedAt);
}
