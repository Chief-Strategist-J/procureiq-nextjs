package com.procureiq.springboot_app.features.tvm.controller;

import com.procureiq.springboot_app.features.tvm.dto.request.TvmCalculationRequest;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmCalculationResponse;
import com.procureiq.springboot_app.features.tvm.service.TvmCalculatorService;
import com.procureiq.springboot_app.features.tvm.messaging.TvmKafkaConsumer;
import com.procureiq.springboot_app.infra.cache.CacheConstants;
import com.procureiq.springboot_app.infra.cache.UserCacheable;
import com.procureiq.springboot_app.infra.config.ApiEndpoints;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.TVM)
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
public class TvmController {

    private final TvmCalculatorService tvmCalculatorService;
    private final TvmKafkaConsumer tvmKafkaConsumer;

    public TvmController(TvmCalculatorService tvmCalculatorService, TvmKafkaConsumer tvmKafkaConsumer) {
        this.tvmCalculatorService = tvmCalculatorService;
        this.tvmKafkaConsumer = tvmKafkaConsumer;
    }

    @UserCacheable(name = CacheConstants.CACHE_TVM_CALCULATIONS)
    @PostMapping(ApiEndpoints.TVM_CALCULATE)
    public ResponseEntity<?> calculateTvm(@Valid @RequestBody TvmCalculationRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            TvmCalculationResponse response = tvmCalculatorService.evaluateTvm(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, response));
        });
    }

    @GetMapping(ApiEndpoints.TVM_TIMESFM_FORECAST)
    public ResponseEntity<?> getLatestTimesfmForecast() {
        return TracingHelper.executeWithTracing(() -> {
            String forecastJson = tvmKafkaConsumer.getLatestForecast();
            return ResponseEntity.ok(ApiSingleResponse.success(200, forecastJson));
        });
    }
}
