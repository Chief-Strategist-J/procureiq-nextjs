package com.procureiq.springboot_app.api.rest.v1.handlers;

import com.procureiq.springboot_app.features.identity.dto.request.AssignRoleRequest;
import com.procureiq.springboot_app.features.identity.dto.response.AuditEventResponse;
import com.procureiq.springboot_app.features.identity.dto.response.ChainVerificationResult;
import com.procureiq.springboot_app.features.identity.dto.response.RoleAssignmentResponse;
import com.procureiq.springboot_app.features.identity.entity.relationships.AuditEvent;
import com.procureiq.springboot_app.features.identity.entity.relationships.RoleAssignment;
import com.procureiq.springboot_app.features.identity.service.AuditLogService;
import com.procureiq.springboot_app.features.identity.service.RoleManagementService;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import com.procureiq.springboot_app.features.tenant.repository.OrganizationRepository;
import com.procureiq.springboot_app.infra.cache.CacheConstants;
import com.procureiq.springboot_app.infra.cache.UserCacheEvict;
import com.procureiq.springboot_app.infra.cache.UserCacheable;
import com.procureiq.springboot_app.infra.config.ApiEndpoints;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import com.procureiq.springboot_app.shared.types.list.ApiListResponse;
import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiEndpoints.IDENTITY)
@CrossOrigin(origins = "*")
public class IdentityAdminController {

    private final RoleManagementService roleManagementService;
    private final AuditLogService auditLogService;
    private final OrganizationRepository organizationRepository;

    public IdentityAdminController(
            RoleManagementService roleManagementService,
            AuditLogService auditLogService,
            OrganizationRepository organizationRepository) {
        this.roleManagementService = roleManagementService;
        this.auditLogService = auditLogService;
        this.organizationRepository = organizationRepository;
    }

    private Long parseOrgId(String orgIdStr) {
        if (orgIdStr == null || orgIdStr.isBlank()) {
            return 1L;
        }
        try {
            return Long.parseLong(orgIdStr.trim());
        } catch (NumberFormatException e) {
            String digits = orgIdStr.replaceAll("\\D+", "");
            if (!digits.isEmpty()) {
                try {
                    return Long.parseLong(digits);
                } catch (NumberFormatException ignored) {}
            }
            return 1L;
        }
    }

    @UserCacheable(name = CacheConstants.CACHE_ORG_METADATA)
    @GetMapping(ApiEndpoints.IDENTITY_ORGANIZATIONS)
    public ResponseEntity<?> getOrganizations() {
        return TracingHelper.executeWithTracing(() -> {
            List<Organization> orgs = organizationRepository.findAll();
            return ResponseEntity.ok(ApiListResponse.success(200, orgs));
        });
    }

    @UserCacheEvict(name = CacheConstants.CACHE_USER_ROLE_ASSIGNMENTS)
    @PostMapping(ApiEndpoints.IDENTITY_ASSIGNMENTS)
    public ResponseEntity<?> assignRole(
            @PathVariable("orgId") String orgIdStr,
            @RequestParam("executorId") Long executorId,
            @Valid @RequestBody AssignRoleRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            Long orgId = parseOrgId(orgIdStr);
            roleManagementService.assignRole(orgId, executorId, request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, CacheConstants.MSG_ROLE_ASSIGNED_SUCCESS));
        });
    }

    @UserCacheable(name = CacheConstants.CACHE_USER_ROLE_ASSIGNMENTS)
    @GetMapping(ApiEndpoints.IDENTITY_ASSIGNMENTS)
    public ResponseEntity<?> getAssignments(
            @PathVariable("orgId") String orgIdStr,
            @RequestParam(value = "principalType", required = false, defaultValue = CacheConstants.DEFAULT_PRINCIPAL_TYPE_USER) String principalType,
            @RequestParam(value = "principalId", required = false, defaultValue = "1") Long principalId) {
        return TracingHelper.executeWithTracing(() -> {
            Long orgId = parseOrgId(orgIdStr);
            List<RoleAssignmentResponse> responseList = roleManagementService
                .getAssignments(orgId, principalType, principalId)
                .stream()
                .map(a -> new RoleAssignmentResponse(
                    a.getId(),
                    Optional.ofNullable(a.getOrganization()).map(Organization::getId).orElse(orgId),
                    Optional.ofNullable(a.getRole()).map(com.procureiq.springboot_app.features.identity.entity.relationships.Role::getId).orElse(null),
                    Optional.ofNullable(a.getRole()).map(com.procureiq.springboot_app.features.identity.entity.relationships.Role::getName).orElse(CacheConstants.DEFAULT_ROLE_USER),
                    a.getPrincipalType(),
                    a.getPrincipalId(),
                    a.getScopeType(),
                    a.getScopeId(),
                    a.getExpiresAt(),
                    a.getCreatedAt()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(ApiListResponse.success(200, responseList));
        });
    }

    @UserCacheable(name = CacheConstants.CACHE_ORG_AUDIT_EVENTS)
    @GetMapping(ApiEndpoints.IDENTITY_AUDIT_EVENTS)
    public ResponseEntity<?> getAuditEvents(@PathVariable("orgId") String orgIdStr) {
        return TracingHelper.executeWithTracing(() -> {
            Long orgId = parseOrgId(orgIdStr);
            List<AuditEventResponse> list = auditLogService
                .getLogs(orgId)
                .stream()
                .map(e -> new AuditEventResponse(
                    e.getId(),
                    Optional.ofNullable(e.getOrganization()).map(Organization::getId).orElse(null),
                    e.getActorType(),
                    e.getActorId(),
                    e.getAction(),
                    e.getResourceType(),
                    e.getResourceId(),
                    e.getSeverity(),
                    e.getBeforeValue(),
                    e.getAfterValue(),
                    e.getRequestId(),
                    e.getSessionId(),
                    e.getIpAddress(),
                    e.getUserAgent(),
                    e.getPrevHash(),
                    e.getEntryHash(),
                    e.getOccurredAt()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(ApiListResponse.success(200, list));
        });
    }

    @PostMapping(ApiEndpoints.IDENTITY_AUDIT_EVENTS_VERIFY)
    public ResponseEntity<?> verifyAuditEvents(@PathVariable("orgId") String orgIdStr) {
        return TracingHelper.executeWithTracing(() -> {
            Long orgId = parseOrgId(orgIdStr);
            ChainVerificationResult result = auditLogService.verifyChainIntegrity(orgId);
            return ResponseEntity.ok(ApiSingleResponse.success(200, result));
        });
    }
}
