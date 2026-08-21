package com.procureiq.springboot_app.features.tvm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.procureiq.springboot_app.features.tvm.dto.request.TvmLedgerSaveRequest;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmLedgerRecordResponse;
import com.procureiq.springboot_app.features.tvm.entity.TvmForecastLedger;
import com.procureiq.springboot_app.features.tvm.repository.TvmLedgerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TvmLedgerService {

    private final TvmLedgerRepository tvmLedgerRepository;
    private final ObjectMapper objectMapper;

    public TvmLedgerService(TvmLedgerRepository tvmLedgerRepository, ObjectMapper objectMapper) {
        this.tvmLedgerRepository = tvmLedgerRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public TvmLedgerRecordResponse saveLedgerRecord(TvmLedgerSaveRequest request) {
        TvmForecastLedger entity = new TvmForecastLedger();
        entity.setId(request.getEventId());
        entity.setTenantId(request.getTenantId());
        entity.setCalculationType(request.getCalculationType());
        entity.setModelName(request.getModelName());
        entity.setHorizon(request.getHorizon());
        entity.setCompoundingFrequency(request.getCompoundingFrequency());
        entity.setForecastJson(request.getForecastJson());

        // Safe defaults for nullable BigDecimal fields from Python response
        entity.setStatedRate(nullsafe(request.getStatedRate()));
        entity.setEffectiveAnnualRate(nullsafe(request.getEffectiveAnnualRate()));
        entity.setRiskFreeRate(nullsafe(request.getRiskFreeRate()));
        entity.setInflationPremium(nullsafe(request.getInflationPremium()));
        entity.setDefaultPremium(nullsafe(request.getDefaultPremium()));
        entity.setLiquidityPremium(nullsafe(request.getLiquidityPremium()));
        entity.setMaturityPremium(nullsafe(request.getMaturityPremium()));
        entity.setPresentValue(nullsafe(request.getPresentValue()));
        entity.setFutureValue(nullsafe(request.getFutureValue()));
        entity.setPmtAmount(nullsafe(request.getPmtAmount()));
        entity.setYears(nullsafe(request.getYears()));

        entity.setCurrencySymbol(request.getCurrencySymbol() != null ? request.getCurrencySymbol() : "$");
        entity.setNotes(request.getNotes() != null ? request.getNotes() : "");
        entity.setActorId(request.getActorId() != null ? request.getActorId() : "system");
        entity.setActorRole(request.getActorRole() != null ? request.getActorRole() : "accountant");
        entity.setCreatedAt(OffsetDateTime.now());

        String cashFlowsJson = serializeCashFlows(request.getCashFlows());
        entity.setCashFlowsJson(cashFlowsJson);

        TvmForecastLedger saved = tvmLedgerRepository.save(entity);
        return TvmLedgerRecordResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<TvmLedgerRecordResponse> getLedgerPage(
        String tenantId,
        String calculationType,
        int page,
        int size
    ) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<TvmForecastLedger> entityPage = (calculationType != null && !calculationType.isBlank())
            ? tvmLedgerRepository.findByTenantIdAndCalculationTypeOrderByCreatedAtDesc(tenantId, calculationType, pageable)
            : tvmLedgerRepository.findByTenantIdOrderByCreatedAtDesc(tenantId, pageable);

        return entityPage.map(TvmLedgerRecordResponse::from);
    }

    @Transactional
    public Optional<TvmLedgerRecordResponse> updateNotes(String id, String tenantId, String notes) {
        int updated = tvmLedgerRepository.updateNotes(id, tenantId, notes);
        if (updated == 0) {
            return Optional.empty();
        }
        return tvmLedgerRepository.findByIdAndTenantId(id, tenantId)
            .map(TvmLedgerRecordResponse::from);
    }

    @Transactional
    public boolean markExported(String id, String tenantId) {
        int updated = tvmLedgerRepository.markExported(id, tenantId, OffsetDateTime.now());
        return updated > 0;
    }

    // --- Private helpers ---

    private BigDecimal nullsafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private String serializeCashFlows(List<Double> cashFlows) {
        if (cashFlows == null || cashFlows.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(cashFlows);
        } catch (Exception e) {
            return "[]";
        }
    }
}
