package com.procureiq.springboot_app.features.tvm.service;

import com.procureiq.springboot_app.features.tvm.dto.request.TvmCalculationRequest;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmCalculationResponse;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmTimeLinePoint;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class TvmCalculatorService {

    public double calculateEar(double statedRate, int frequency) {
        if (frequency <= 0) {
            return Math.exp(statedRate) - 1.0;
        }
        return Math.pow(1.0 + (statedRate / frequency), frequency) - 1.0;
    }

    public double calculateNominalRate(double riskFreeRate, double inflationPremium, double defaultPremium, double liquidityPremium, double maturityPremium) {
        return riskFreeRate + inflationPremium + defaultPremium + liquidityPremium + maturityPremium;
    }

    public double calculateSingleSumFv(double pv, double statedRate, int frequency, double years) {
        if (frequency <= 0) {
            return pv * Math.exp(statedRate * years);
        }
        double ratePerPeriod = statedRate / frequency;
        double totalPeriods = frequency * years;
        return pv * Math.pow(1.0 + ratePerPeriod, totalPeriods);
    }

    public double calculateSingleSumPv(double fv, double statedRate, int frequency, double years) {
        if (frequency <= 0) {
            return fv / Math.exp(statedRate * years);
        }
        double ratePerPeriod = statedRate / frequency;
        double totalPeriods = frequency * years;
        return fv / Math.pow(1.0 + ratePerPeriod, totalPeriods);
    }

    public double calculateOrdinaryAnnuityPv(double pmt, double ratePerPeriod, int totalPeriods) {
        if (ratePerPeriod == 0) return pmt * totalPeriods;
        return pmt * ((1.0 - Math.pow(1.0 + ratePerPeriod, -totalPeriods)) / ratePerPeriod);
    }

    public double calculateOrdinaryAnnuityFv(double pmt, double ratePerPeriod, int totalPeriods) {
        if (ratePerPeriod == 0) return pmt * totalPeriods;
        return pmt * ((Math.pow(1.0 + ratePerPeriod, totalPeriods) - 1.0) / ratePerPeriod);
    }

    public double calculateAnnuityDuePv(double pmt, double ratePerPeriod, int totalPeriods) {
        return calculateOrdinaryAnnuityPv(pmt, ratePerPeriod, totalPeriods) * (1.0 + ratePerPeriod);
    }

    public double calculateAnnuityDueFv(double pmt, double ratePerPeriod, int totalPeriods) {
        return calculateOrdinaryAnnuityFv(pmt, ratePerPeriod, totalPeriods) * (1.0 + ratePerPeriod);
    }

    public double calculatePerpetuityPv(double pmt, double ratePerPeriod) {
        if (ratePerPeriod <= 0) throw new IllegalArgumentException("Discount rate for perpetuity must be positive");
        return pmt / ratePerPeriod;
    }

    public double calculateUnequalCashFlowsPv(List<Double> cashFlows, double ratePerPeriod) {
        return IntStream.range(0, cashFlows.size())
                .mapToDouble(t -> cashFlows.get(t) / Math.pow(1.0 + ratePerPeriod, t + 1))
                .sum();
    }

    public TvmCalculationResponse evaluateTvm(TvmCalculationRequest request) {
        double r = request.getStatedRate();
        int m = request.getFrequency() > 0 ? request.getFrequency() : 1;
        double ratePerPeriod = r / m;
        int nPeriods = (int) (request.getYears() * m);
        double ear = calculateEar(r, request.getFrequency());

        double pv = 0.0;
        double fv = 0.0;

        String type = Optional.ofNullable(request.getCalculationType()).orElse("SINGLE_SUM").toUpperCase();

        switch (type) {
            case "ORDINARY_ANNUITY":
                pv = calculateOrdinaryAnnuityPv(request.getPmt(), ratePerPeriod, nPeriods);
                fv = calculateOrdinaryAnnuityFv(request.getPmt(), ratePerPeriod, nPeriods);
                break;
            case "ANNUITY_DUE":
                pv = calculateAnnuityDuePv(request.getPmt(), ratePerPeriod, nPeriods);
                fv = calculateAnnuityDueFv(request.getPmt(), ratePerPeriod, nPeriods);
                break;
            case "PERPETUITY":
                pv = calculatePerpetuityPv(request.getPmt(), ratePerPeriod);
                fv = Double.POSITIVE_INFINITY;
                break;
            case "UNEQUAL_FLOWS":
                List<Double> flows = Optional.ofNullable(request.getCashFlows()).orElse(List.of(100.0, 200.0, 300.0));
                pv = calculateUnequalCashFlowsPv(flows, ratePerPeriod);
                fv = pv * Math.pow(1.0 + ratePerPeriod, flows.size());
                break;
            case "SINGLE_SUM":
            DEFAULT:
                pv = request.getPv() != 0.0 ? request.getPv() : calculateSingleSumPv(request.getFv(), r, m, request.getYears());
                fv = request.getFv() != 0.0 ? request.getFv() : calculateSingleSumFv(pv, r, m, request.getYears());
                break;
        }

        final double finalPv = pv;
        List<TvmTimeLinePoint> timeline = IntStream.rangeClosed(0, Math.min(nPeriods, 120))
                .mapToObj(period -> {
                    double compoundFactor = Math.pow(1.0 + ratePerPeriod, period);
                    double discountFactor = 1.0 / compoundFactor;
                    double periodValue = finalPv * compoundFactor;
                    return new TvmTimeLinePoint(period, periodValue, discountFactor, compoundFactor);
                })
                .collect(Collectors.toList());

        return new TvmCalculationResponse(
                type,
                r,
                m,
                ear,
                request.getYears(),
                nPeriods,
                pv,
                fv,
                request.getPmt(),
                timeline
        );
    }
}
