package com.procureiq.springboot_app.features.tvm.dto.request;

import jakarta.validation.constraints.Min;
import java.util.List;

public class TvmCalculationRequest {
    private String calculationType;
    private double pv;
    private double fv;
    private double pmt;
    private double statedRate = 0.08;
    
    @Min(value = 0, message = "Frequency must be non-negative")
    private int frequency = 12;
    
    private double years = 5.0;
    private List<Double> cashFlows;

    public String getCalculationType() { return calculationType; }
    public void setCalculationType(String calculationType) { this.calculationType = calculationType; }

    public double getPv() { return pv; }
    public void setPv(double pv) { this.pv = pv; }

    public double getFv() { return fv; }
    public void setFv(double fv) { this.fv = fv; }

    public double getPmt() { return pmt; }
    public void setPmt(double pmt) { this.pmt = pmt; }

    public double getStatedRate() { return statedRate; }
    public void setStatedRate(double statedRate) { this.statedRate = statedRate; }

    public int getFrequency() { return frequency; }
    public void setFrequency(int frequency) { this.frequency = frequency; }

    public double getYears() { return years; }
    public void setYears(double years) { this.years = years; }

    public List<Double> getCashFlows() { return cashFlows; }
    public void setCashFlows(List<Double> cashFlows) { this.cashFlows = cashFlows; }
}
