package com.procureiq.springboot_app.features.tvm.dto.response;

public class TvmTimeLinePoint {
    private final int period;
    private final double periodValue;
    private final double discountFactor;
    private final double compoundFactor;

    public TvmTimeLinePoint(int period, double periodValue, double discountFactor, double compoundFactor) {
        this.period = period;
        this.periodValue = periodValue;
        this.discountFactor = discountFactor;
        this.compoundFactor = compoundFactor;
    }

    public int getPeriod() { return period; }
    public double getPeriodValue() { return periodValue; }
    public double getDiscountFactor() { return discountFactor; }
    public double getCompoundFactor() { return compoundFactor; }
}
