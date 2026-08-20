package com.procureiq.springboot_app.infra.events;

import java.util.List;

public class TvmForecastEvent {
    private String eventId;
    private String timestamp;
    private String modelName;
    private int horizon;
    private List<Double> historicalData;
    private List<Double> forecastPoint;
    private List<Double> quantile10;
    private List<Double> quantile90;
    private double statedRate;
    private int frequency;
    private double effectiveAnnualRate;
    private double riskFreeRate;
    private double inflationPremium;
    private double defaultPremium;
    private double liquidityPremium;
    private double maturityPremium;

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public int getHorizon() { return horizon; }
    public void setHorizon(int horizon) { this.horizon = horizon; }

    public List<Double> getHistoricalData() { return historicalData; }
    public void setHistoricalData(List<Double> historicalData) { this.historicalData = historicalData; }

    public List<Double> getForecastPoint() { return forecastPoint; }
    public void setForecastPoint(List<Double> forecastPoint) { this.forecastPoint = forecastPoint; }

    public List<Double> getQuantile10() { return quantile10; }
    public void setQuantile10(List<Double> quantile10) { this.quantile10 = quantile10; }

    public List<Double> getQuantile90() { return quantile90; }
    public void setQuantile90(List<Double> quantile90) { this.quantile90 = quantile90; }

    public double getStatedRate() { return statedRate; }
    public void setStatedRate(double statedRate) { this.statedRate = statedRate; }

    public int getFrequency() { return frequency; }
    public void setFrequency(int frequency) { this.frequency = frequency; }

    public double getEffectiveAnnualRate() { return effectiveAnnualRate; }
    public void setEffectiveAnnualRate(double effectiveAnnualRate) { this.effectiveAnnualRate = effectiveAnnualRate; }

    public double getRiskFreeRate() { return riskFreeRate; }
    public void setRiskFreeRate(double riskFreeRate) { this.riskFreeRate = riskFreeRate; }

    public double getInflationPremium() { return inflationPremium; }
    public void setInflationPremium(double inflationPremium) { this.inflationPremium = inflationPremium; }

    public double getDefaultPremium() { return defaultPremium; }
    public void setDefaultPremium(double defaultPremium) { this.defaultPremium = defaultPremium; }

    public double getLiquidityPremium() { return liquidityPremium; }
    public void setLiquidityPremium(double liquidityPremium) { this.liquidityPremium = liquidityPremium; }

    public double getMaturityPremium() { return maturityPremium; }
    public void setMaturityPremium(double maturityPremium) { this.maturityPremium = maturityPremium; }
}
