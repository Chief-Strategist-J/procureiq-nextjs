package com.procureiq.springboot_app.features.tvm.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
    name = "tvm_forecast_ledger",
    indexes = {
        @Index(name = "idx_tvm_forecast_tenant", columnList = "tenant_id, created_at DESC"),
        @Index(name = "idx_tvm_ledger_calc_type", columnList = "tenant_id, calculation_type, created_at DESC")
    }
)
public class TvmForecastLedger {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "tenant_id", length = 64, nullable = false)
    private String tenantId = "default-tenant";

    @Column(name = "model_name", length = 128, nullable = false)
    private String modelName = "google/timesfm-1.0-200m";

    @Column(name = "horizon", nullable = false)
    private int horizon = 12;

    @Column(name = "stated_rate", precision = 10, scale = 6, nullable = false)
    private BigDecimal statedRate;

    @Column(name = "compounding_frequency", nullable = false)
    private int compoundingFrequency = 12;

    @Column(name = "effective_annual_rate", precision = 10, scale = 6, nullable = false)
    private BigDecimal effectiveAnnualRate;

    @Column(name = "risk_free_rate", precision = 10, scale = 6, nullable = false)
    private BigDecimal riskFreeRate;

    @Column(name = "inflation_premium", precision = 10, scale = 6, nullable = false)
    private BigDecimal inflationPremium;

    @Column(name = "default_premium", precision = 10, scale = 6, nullable = false)
    private BigDecimal defaultPremium;

    @Column(name = "liquidity_premium", precision = 10, scale = 6, nullable = false)
    private BigDecimal liquidityPremium;

    @Column(name = "maturity_premium", precision = 10, scale = 6, nullable = false)
    private BigDecimal maturityPremium;

    @Column(name = "forecast_json", columnDefinition = "TEXT", nullable = false)
    private String forecastJson = "{}";

    @Column(name = "calculation_type", length = 32, nullable = false)
    private String calculationType = "SINGLE_SUM";

    @Column(name = "present_value", precision = 20, scale = 4, nullable = false)
    private BigDecimal presentValue = BigDecimal.ZERO;

    @Column(name = "future_value", precision = 20, scale = 4, nullable = false)
    private BigDecimal futureValue = BigDecimal.ZERO;

    @Column(name = "pmt_amount", precision = 20, scale = 4, nullable = false)
    private BigDecimal pmtAmount = BigDecimal.ZERO;

    @Column(name = "years", precision = 10, scale = 4, nullable = false)
    private BigDecimal years = BigDecimal.ONE;

    @Column(name = "currency_symbol", length = 10, nullable = false)
    private String currencySymbol = "$";

    @Column(name = "notes", columnDefinition = "TEXT", nullable = false)
    private String notes = "";

    @Column(name = "cash_flows_json", columnDefinition = "TEXT", nullable = false)
    private String cashFlowsJson = "[]";

    @Column(name = "exported_at")
    private OffsetDateTime exportedAt;

    @Column(name = "actor_id", length = 64, nullable = false)
    private String actorId = "system";

    @Column(name = "actor_role", length = 64, nullable = false)
    private String actorRole = "accountant";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // --- Getters & Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public int getHorizon() { return horizon; }
    public void setHorizon(int horizon) { this.horizon = horizon; }

    public BigDecimal getStatedRate() { return statedRate; }
    public void setStatedRate(BigDecimal statedRate) { this.statedRate = statedRate; }

    public int getCompoundingFrequency() { return compoundingFrequency; }
    public void setCompoundingFrequency(int compoundingFrequency) { this.compoundingFrequency = compoundingFrequency; }

    public BigDecimal getEffectiveAnnualRate() { return effectiveAnnualRate; }
    public void setEffectiveAnnualRate(BigDecimal effectiveAnnualRate) { this.effectiveAnnualRate = effectiveAnnualRate; }

    public BigDecimal getRiskFreeRate() { return riskFreeRate; }
    public void setRiskFreeRate(BigDecimal riskFreeRate) { this.riskFreeRate = riskFreeRate; }

    public BigDecimal getInflationPremium() { return inflationPremium; }
    public void setInflationPremium(BigDecimal inflationPremium) { this.inflationPremium = inflationPremium; }

    public BigDecimal getDefaultPremium() { return defaultPremium; }
    public void setDefaultPremium(BigDecimal defaultPremium) { this.defaultPremium = defaultPremium; }

    public BigDecimal getLiquidityPremium() { return liquidityPremium; }
    public void setLiquidityPremium(BigDecimal liquidityPremium) { this.liquidityPremium = liquidityPremium; }

    public BigDecimal getMaturityPremium() { return maturityPremium; }
    public void setMaturityPremium(BigDecimal maturityPremium) { this.maturityPremium = maturityPremium; }

    public String getForecastJson() { return forecastJson; }
    public void setForecastJson(String forecastJson) { this.forecastJson = forecastJson; }

    public String getCalculationType() { return calculationType; }
    public void setCalculationType(String calculationType) { this.calculationType = calculationType; }

    public BigDecimal getPresentValue() { return presentValue; }
    public void setPresentValue(BigDecimal presentValue) { this.presentValue = presentValue; }

    public BigDecimal getFutureValue() { return futureValue; }
    public void setFutureValue(BigDecimal futureValue) { this.futureValue = futureValue; }

    public BigDecimal getPmtAmount() { return pmtAmount; }
    public void setPmtAmount(BigDecimal pmtAmount) { this.pmtAmount = pmtAmount; }

    public BigDecimal getYears() { return years; }
    public void setYears(BigDecimal years) { this.years = years; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCashFlowsJson() { return cashFlowsJson; }
    public void setCashFlowsJson(String cashFlowsJson) { this.cashFlowsJson = cashFlowsJson; }

    public OffsetDateTime getExportedAt() { return exportedAt; }
    public void setExportedAt(OffsetDateTime exportedAt) { this.exportedAt = exportedAt; }

    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
