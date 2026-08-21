package com.procureiq.springboot_app.features.tvm.controller;

import com.procureiq.springboot_app.features.tvm.dto.request.TvmCalculationRequest;
import com.procureiq.springboot_app.features.tvm.dto.request.TvmLedgerSaveRequest;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmCalculationResponse;
import com.procureiq.springboot_app.features.tvm.dto.response.TvmLedgerRecordResponse;
import com.procureiq.springboot_app.features.tvm.service.TvmCalculatorService;
import com.procureiq.springboot_app.features.tvm.service.TvmLedgerService;
import com.procureiq.springboot_app.features.tvm.messaging.TvmKafkaConsumer;
import com.procureiq.springboot_app.infra.cache.CacheConstants;
import com.procureiq.springboot_app.infra.cache.UserCacheable;
import com.procureiq.springboot_app.infra.config.ApiEndpoints;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import com.procureiq.springboot_app.shared.types.paged.ApiPagedResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiEndpoints.TVM)
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
public class TvmController {

    private final TvmCalculatorService tvmCalculatorService;
    private final TvmLedgerService tvmLedgerService;
    private final TvmKafkaConsumer tvmKafkaConsumer;

    public TvmController(
        TvmCalculatorService tvmCalculatorService,
        TvmLedgerService tvmLedgerService,
        TvmKafkaConsumer tvmKafkaConsumer
    ) {
        this.tvmCalculatorService = tvmCalculatorService;
        this.tvmLedgerService = tvmLedgerService;
        this.tvmKafkaConsumer = tvmKafkaConsumer;
    }

    // ── Existing: TVM Calculate ─────────────────────────────────────────────

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

    // ── CA Ledger: Save a calculation record ────────────────────────────────

    @PostMapping(ApiEndpoints.TVM_LEDGER)
    public ResponseEntity<?> saveLedgerRecord(
        @Valid @RequestBody TvmLedgerSaveRequest request,
        @RequestHeader(value = "X-Tenant-Id", defaultValue = "default-tenant") String tenantId,
        @RequestHeader(value = "X-User-Id",   defaultValue = "system")         String actorId,
        @RequestHeader(value = "X-User-Role", defaultValue = "accountant")     String actorRole
    ) {
        return TracingHelper.executeWithTracing(() -> {
            request.setTenantId(tenantId);
            request.setActorId(actorId);
            request.setActorRole(actorRole);
            TvmLedgerRecordResponse response = tvmLedgerService.saveLedgerRecord(request);
            return ResponseEntity.ok(ApiSingleResponse.success(201, response));
        });
    }

    // ── CA Ledger: Paginated history ────────────────────────────────────────

    @GetMapping(ApiEndpoints.TVM_LEDGER)
    public ResponseEntity<?> getLedger(
        @RequestHeader(value = "X-Tenant-Id", defaultValue = "default-tenant") String tenantId,
        @RequestParam(value = "calculationType", required = false) String calculationType,
        @RequestParam(value = "page", defaultValue = "0")  int page,
        @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return TracingHelper.executeWithTracing(() -> {
            Page<TvmLedgerRecordResponse> paginated = tvmLedgerService.getLedgerPage(
                tenantId, calculationType, page, size
            );
            return ResponseEntity.ok(ApiPagedResponse.success(200, paginated));
        });
    }

    // ── CA Ledger: Update notes ─────────────────────────────────────────────

    @PatchMapping(ApiEndpoints.TVM_LEDGER_ID + "/notes")
    public ResponseEntity<?> updateNotes(
        @PathVariable String ledgerId,
        @RequestHeader(value = "X-Tenant-Id", defaultValue = "default-tenant") String tenantId,
        @RequestBody Map<String, String> body
    ) {
        return TracingHelper.executeWithTracing(() -> {
            String notes = body.getOrDefault("notes", "");
            Optional<TvmLedgerRecordResponse> result = tvmLedgerService.updateNotes(ledgerId, tenantId, notes);
            return result
                .map(r -> ResponseEntity.ok(ApiSingleResponse.success(200, r)))
                .orElse(ResponseEntity.notFound().build());
        });
    }

    // ── CA Ledger: Mark exported ────────────────────────────────────────────

    @PostMapping(ApiEndpoints.TVM_LEDGER_EXPORT)
    public ResponseEntity<?> markExported(
        @PathVariable String ledgerId,
        @RequestHeader(value = "X-Tenant-Id", defaultValue = "default-tenant") String tenantId
    ) {
        return TracingHelper.executeWithTracing(() -> {
            boolean success = tvmLedgerService.markExported(ledgerId, tenantId);
            if (!success) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ApiSingleResponse.success(200, Map.of("exported", true)));
        });
    }
}
