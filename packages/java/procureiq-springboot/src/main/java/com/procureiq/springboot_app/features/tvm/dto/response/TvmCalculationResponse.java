package com.procureiq.springboot_app.features.tvm.dto.response;

import java.util.List;

public class TvmCalculationResponse {
    private final String calculationType;
    private final double statedRate;
    private final int frequency;
    private final double effectiveAnnualRate;
    private final double years;
    private final int totalPeriods;
    private final double presentValue;
    private final double futureValue;
    private final double pmt;
    private final List<TvmTimeLinePoint> timeline;

    public TvmCalculationResponse(
            String calculationType,
            double statedRate,
            int frequency,
            double effectiveAnnualRate,
            double years,
            int totalPeriods,
            double presentValue,
            double futureValue,
            double pmt,
            List<TvmTimeLinePoint> timeline) {
        this.calculationType = calculationType;
        this.statedRate = statedRate;
        this.frequency = frequency;
        this.effectiveAnnualRate = effectiveAnnualRate;
        this.years = years;
        this.totalPeriods = totalPeriods;
        this.presentValue = presentValue;
        this.futureValue = futureValue;
        this.pmt = pmt;
        this.timeline = timeline;
    }

    public String getCalculationType() { return calculationType; }
    public double getStatedRate() { return statedRate; }
    public int getFrequency() { return frequency; }
    public double getEffectiveAnnualRate() { return effectiveAnnualRate; }
    public double getYears() { return years; }
    public int getTotalPeriods() { return totalPeriods; }
    public double getPresentValue() { return presentValue; }
    public double getFutureValue() { return futureValue; }
    public double getPmt() { return pmt; }
    public List<TvmTimeLinePoint> getTimeline() { return timeline; }
}
