package com.procureiq.springboot_app.features.tvm.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class TvmLedgerRecordResponse {

    private String id;
    private String tenantId;
    private String calculationType;
    private BigDecimal statedRate;
    private int compoundingFrequency;
    private BigDecimal effectiveAnnualRate;
    private BigDecimal presentValue;
    private BigDecimal futureValue;
    private BigDecimal pmtAmount;
    private BigDecimal years;
    private String currencySymbol;
    private String notes;
    private String cashFlowsJson;
    private String modelName;
    private OffsetDateTime exportedAt;
    private String actorId;
    private String actorRole;
    private OffsetDateTime createdAt;

    // --- Factory from entity ---

    public static TvmLedgerRecordResponse from(
        com.procureiq.springboot_app.features.tvm.entity.TvmForecastLedger entity
    ) {
        TvmLedgerRecordResponse r = new TvmLedgerRecordResponse();
        r.id = entity.getId();
        r.tenantId = entity.getTenantId();
        r.calculationType = entity.getCalculationType();
        r.statedRate = entity.getStatedRate();
        r.compoundingFrequency = entity.getCompoundingFrequency();
        r.effectiveAnnualRate = entity.getEffectiveAnnualRate();
        r.presentValue = entity.getPresentValue();
        r.futureValue = entity.getFutureValue();
        r.pmtAmount = entity.getPmtAmount();
        r.years = entity.getYears();
        r.currencySymbol = entity.getCurrencySymbol();
        r.notes = entity.getNotes();
        r.cashFlowsJson = entity.getCashFlowsJson();
        r.modelName = entity.getModelName();
        r.exportedAt = entity.getExportedAt();
        r.actorId = entity.getActorId();
        r.actorRole = entity.getActorRole();
        r.createdAt = entity.getCreatedAt();
        return r;
    }

    // --- Getters ---

    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getCalculationType() { return calculationType; }
    public BigDecimal getStatedRate() { return statedRate; }
    public int getCompoundingFrequency() { return compoundingFrequency; }
    public BigDecimal getEffectiveAnnualRate() { return effectiveAnnualRate; }
    public BigDecimal getPresentValue() { return presentValue; }
    public BigDecimal getFutureValue() { return futureValue; }
    public BigDecimal getPmtAmount() { return pmtAmount; }
    public BigDecimal getYears() { return years; }
    public String getCurrencySymbol() { return currencySymbol; }
    public String getNotes() { return notes; }
    public String getCashFlowsJson() { return cashFlowsJson; }
    public String getModelName() { return modelName; }
    public OffsetDateTime getExportedAt() { return exportedAt; }
    public String getActorId() { return actorId; }
    public String getActorRole() { return actorRole; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
