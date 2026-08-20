package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.LoginRequest;
import com.procureiq.springboot_app.features.auth.dto.response.LoginResponse;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.mapper.UserMapper;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.features.auth.service.JwtTokenProvider;
import com.procureiq.springboot_app.features.auth.service.UserAccountLockService;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class LoginCommandHandler implements AuthCommandHandler<LoginRequest, LoginResponse> {

    private static final long REFRESH_TOKEN_EXPIRATION_DAYS = 7;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserAccountLockService lockService;
    private final UserMapper userMapper;

    public LoginCommandHandler(
            UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider,
            UserAccountLockService lockService,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.lockService = lockService;
        this.userMapper = userMapper;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.LOGIN;
    }

    @Override
    public LoginResponse execute(LoginRequest request) {
        String contextTenant = com.procureiq.springboot_app.shared.tenant.TenantContext.getTenantId();
        String activeTenantId = contextTenant != null && !contextTenant.equalsIgnoreCase("default")
            ? contextTenant.trim().toLowerCase(java.util.Locale.ROOT)
            : Optional.ofNullable(request.getTenantId()).map(String::trim).map(s -> s.toLowerCase(java.util.Locale.ROOT)).orElse("default");

        return AuthPipeline.of(request)
            .map(req -> userRepository.findByIdentifierAndTenantId(req.getUsername().trim(), activeTenantId)
                .orElseThrow(() -> new UnauthorizedException(AuthConstants.MSG_INVALID_CREDENTIALS)))
            .peek(user -> lockService.checkAndHandleAccountLockState(user))
            .peek(user -> lockService.verifyPasswordAndHandleFailure(user, request.getPassword().trim()))
            .map(user -> {
                String accessToken = jwtTokenProvider.generateAccessToken(user);
                String refreshToken = UUID.randomUUID().toString();
                LocalDateTime refreshExpiry = LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRATION_DAYS);
                User authenticatedUser = userRepository.save(user.withSuccessfulLogin(refreshToken, refreshExpiry));
                return new LoginResponse(accessToken, refreshToken, userMapper.toUserResponse(authenticatedUser));
            })
            .get();
    }
}
