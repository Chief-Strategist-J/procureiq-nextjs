package com.procureiq.springboot_app.features.tvm.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;

public class TvmLedgerSaveRequest {

    @NotBlank(message = "eventId is required")
    private String eventId;

    private String tenantId = "default-tenant";
    private String calculationType = "SINGLE_SUM";
    private BigDecimal statedRate;
    private int compoundingFrequency = 12;
    private BigDecimal effectiveAnnualRate;
    private BigDecimal riskFreeRate;
    private BigDecimal inflationPremium;
    private BigDecimal defaultPremium;
    private BigDecimal liquidityPremium;
    private BigDecimal maturityPremium;
    private BigDecimal presentValue;
    private BigDecimal futureValue;
    private BigDecimal pmtAmount;
    private BigDecimal years;
    private String currencySymbol = "$";
    private String notes = "";
    private List<Double> cashFlows;
    private String forecastJson = "{}";
    private String modelName = "google/timesfm-1.0-200m";
    private int horizon = 12;
    private String actorId = "system";
    private String actorRole = "accountant";

    // --- Getters & Setters ---

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getCalculationType() { return calculationType; }
    public void setCalculationType(String calculationType) { this.calculationType = calculationType; }

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

    public List<Double> getCashFlows() { return cashFlows; }
    public void setCashFlows(List<Double> cashFlows) { this.cashFlows = cashFlows; }

    public String getForecastJson() { return forecastJson; }
    public void setForecastJson(String forecastJson) { this.forecastJson = forecastJson; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public int getHorizon() { return horizon; }
    public void setHorizon(int horizon) { this.horizon = horizon; }

    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
}
