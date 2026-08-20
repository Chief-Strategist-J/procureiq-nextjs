package com.procureiq.springboot_app;

import com.procureiq.springboot_app.features.tvm.dto.request.TvmCalculationRequest;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmCalculationResponse;
import com.procureiq.springboot_app.features.tvm.service.TvmCalculatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TvmCalculatorServiceTest {

    private TvmCalculatorService tvmService;

    @BeforeEach
    public void setUp() {
        tvmService = new TvmCalculatorService();
    }

    @Test
    public void testEffectiveAnnualRateCompounding() {
        double earMonthly = tvmService.calculateEar(0.08, 12);
        assertEquals(0.083000, earMonthly, 0.0001);

        double earContinuous = tvmService.calculateEar(0.08, 0);
        assertEquals(0.083287, earContinuous, 0.0001);
    }

    @Test
    public void testSingleSumPvFv() {
        double fv = tvmService.calculateSingleSumFv(1000.0, 0.05, 1, 3.0);
        assertEquals(1157.625, fv, 0.01);

        double pv = tvmService.calculateSingleSumPv(fv, 0.05, 1, 3.0);
        assertEquals(1000.0, pv, 0.01);
    }

    @Test
    public void testOrdinaryAnnuityVsAnnuityDue() {
        double pmt = 100.0;
        double r = 0.05;
        int n = 5;

        double pvOrd = tvmService.calculateOrdinaryAnnuityPv(pmt, r, n);
        double pvDue = tvmService.calculateAnnuityDuePv(pmt, r, n);

        assertEquals(pvOrd * (1.0 + r), pvDue, 0.001);
    }

    @Test
    public void testPerpetuity() {
        double pvPerp = tvmService.calculatePerpetuityPv(50.0, 0.05);
        assertEquals(1000.0, pvPerp, 0.001);
    }

    @Test
    public void testUnequalCashFlows() {
        List<Double> flows = List.of(100.0, 200.0, 300.0);
        double r = 0.10;

        double pv = tvmService.calculateUnequalCashFlowsPv(flows, r);
        assertEquals(481.59, pv, 0.01);
    }

    @Test
    public void testEvaluateTvmFullEngine() {
        TvmCalculationRequest request = new TvmCalculationRequest();
        request.setCalculationType("ORDINARY_ANNUITY");
        request.setPmt(500.0);
        request.setStatedRate(0.06);
        request.setFrequency(12);
        request.setYears(3.0);

        TvmCalculationResponse response = tvmService.evaluateTvm(request);
        assertNotNull(response);
        assertEquals("ORDINARY_ANNUITY", response.getCalculationType());
        assertTrue(response.getPresentValue() > 0);
        assertTrue(response.getFutureValue() > response.getPresentValue());
        assertEquals(37, response.getTimeline().size());
    }
}
