package com.procureiq.springboot_app.features.identity.service;

import com.procureiq.springboot_app.features.identity.entity.relationships.RoleAssignment;
import com.procureiq.springboot_app.features.identity.entity.relationships.Role;
import com.procureiq.springboot_app.features.identity.entity.User;
import com.procureiq.springboot_app.features.tenant.entity.Organization;
import com.procureiq.springboot_app.features.tenant.repository.OrganizationRepository;
import com.procureiq.springboot_app.features.identity.repository.RoleAssignmentRepository;
import com.procureiq.springboot_app.features.identity.repository.RoleRepository;
import com.procureiq.springboot_app.features.identity.repository.IdentityUserRepository;
import com.procureiq.springboot_app.features.identity.dto.request.AssignRoleRequest;
import com.procureiq.springboot_app.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RoleManagementService {

    private final RoleAssignmentRepository roleAssignmentRepository;
    private final RoleRepository roleRepository;
    private final IdentityUserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final AuditLogService auditLogService;

    public RoleManagementService(
            RoleAssignmentRepository roleAssignmentRepository,
            RoleRepository roleRepository,
            IdentityUserRepository userRepository,
            OrganizationRepository organizationRepository,
            AuditLogService auditLogService) {
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<RoleAssignment> getAssignments(Long orgId, String principalType, Long principalId) {
        List<RoleAssignment> list = roleAssignmentRepository.findByOrganizationIdAndPrincipalTypeAndPrincipalId(orgId, principalType, principalId);
        for (RoleAssignment assignment : list) {
            if (assignment.getRole() != null) {
                assignment.getRole().getName();
            }
            if (assignment.getOrganization() != null) {
                assignment.getOrganization().getName();
            }
        }
        return list;
    }

    @Transactional
    public void assignRole(Long orgId, Long executorUserId, AssignRoleRequest request) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseGet(() -> {
                    Organization org = new Organization();
                    org.setId(orgId);
                    org.setName("Default Org #" + orgId);
                    return organizationRepository.save(org);
                });

        Role role = roleRepository.findById(request.roleId())
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setId(request.roleId());
                    r.setName("Role-" + request.roleId());
                    r.setOrganization(organization);
                    return roleRepository.save(r);
                });

        User executor = userRepository.findById(executorUserId)
                .orElseGet(() -> {
                    User u = new User();
                    u.setId(executorUserId);
                    u.setEmail("executor" + executorUserId + "@procureiq.com");
                    return userRepository.save(u);
                });

        RoleAssignment assignment = new RoleAssignment();
        assignment.setId(ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE));
        assignment.setOrganization(organization);
        assignment.setRole(role);
        assignment.setPrincipalType(request.principalType());
        assignment.setPrincipalId(request.principalId());
        assignment.setScopeType(request.scopeType());
        assignment.setScopeId(request.scopeId());
        assignment.setGranter(executor);

        if (request.expiresAfterSeconds() != null) {
            assignment.setExpiresAt(Instant.now().plusSeconds(request.expiresAfterSeconds()));
        }

        roleAssignmentRepository.save(assignment);

        String changesJson = String.format("{\"role_id\": %d, \"principal_type\": \"%s\", \"principal_id\": %d}", role.getId(), request.principalType(), request.principalId());
        auditLogService.log(
            orgId, "user", executorUserId, "role.granted", "role_assignment", assignment.getId(),
            "security_critical", null, changesJson, null, null, null, null
        );
    }
}
