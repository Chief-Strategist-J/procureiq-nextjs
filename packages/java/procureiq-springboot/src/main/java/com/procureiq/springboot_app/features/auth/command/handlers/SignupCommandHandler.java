package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.SignupRequest;
import com.procureiq.springboot_app.features.auth.dto.response.SignupResponse;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.mapper.UserMapper;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.features.auth.service.JwtTokenProvider;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import com.procureiq.springboot_app.features.tenant.service.TenantService;
import com.procureiq.springboot_app.shared.exceptions.UserAlreadyExistsException;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import com.procureiq.springboot_app.shared.utils.JsonUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SignupCommandHandler implements AuthCommandHandler<SignupRequest, SignupResponse> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TenantService tenantService;
    private final UserMapper userMapper;

    public SignupCommandHandler(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            TenantService tenantService,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tenantService = tenantService;
        this.userMapper = userMapper;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.SIGNUP;
    }

    @Override
    public SignupResponse execute(SignupRequest request) {
        String contextTenant = com.procureiq.springboot_app.shared.tenant.TenantContext.getTenantId();
        String activeTenantId = contextTenant != null && !contextTenant.equalsIgnoreCase("default")
            ? contextTenant.trim().toLowerCase(java.util.Locale.ROOT)
            : Optional.ofNullable(request.getTenantId()).map(String::trim).map(s -> s.toLowerCase(java.util.Locale.ROOT)).orElse("default");

        return AuthPipeline.of(request)
            .peek(req -> tenantService.getOrCreateTenant(activeTenantId, req.getCompanyName()))
            .map(req -> userRepository.findByEmailAndTenantId(req.getEmail(), activeTenantId)
                .map(existingUser -> handleExistingUser(existingUser, req.getPassword()))
                .orElseGet(() -> createAndSaveUser(req, activeTenantId)))
            .get();
    }

    private SignupResponse handleExistingUser(User existingUser, String rawPassword) {
        return Optional.of(rawPassword)
            .filter(pwd -> passwordEncoder.matches(pwd, existingUser.getPassword()))
            .map(pwd -> new SignupResponse(userMapper.toUserResponse(existingUser), jwtTokenProvider.generateAccessToken(existingUser), true))
            .orElseThrow(() -> new UserAlreadyExistsException(AuthConstants.MSG_USER_EXISTS));
    }

    private SignupResponse createAndSaveUser(SignupRequest request, String activeTenantId) {
        Tenant tenant = tenantService.getOrCreateTenant(activeTenantId, request.getCompanyName());

        User user = User.create(
            request.getUsername(),
            passwordEncoder.encode(request.getPassword()),
            request.getEmail(),
            request.getRole(),
            JsonUtils.serializeMetadata(request.getRoleMetadata()),
            tenant.getSlug()
        );

        User savedUser = userRepository.save(user);
        tenantService.attachUserToTenant(tenant, savedUser, request.getRole());

        return new SignupResponse(userMapper.toUserResponse(savedUser), jwtTokenProvider.generateAccessToken(savedUser), true);
    }
}
