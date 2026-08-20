package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.RefreshTokenRequest;
import com.procureiq.springboot_app.features.auth.dto.response.RefreshTokenResponse;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.features.auth.service.JwtTokenProvider;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class RefreshTokenCommandHandler implements AuthCommandHandler<RefreshTokenRequest, RefreshTokenResponse> {

    private static final long REFRESH_TOKEN_EXPIRATION_DAYS = 7;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public RefreshTokenCommandHandler(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.REFRESH_TOKEN;
    }

    @Override
    public RefreshTokenResponse execute(RefreshTokenRequest request) {
        return AuthPipeline.of(request)
            .map(req -> userRepository.findByRefreshToken(req.getRefreshToken().trim())
                .orElseThrow(() -> new UnauthorizedException(AuthConstants.MSG_INVALID_REFRESH_TOKEN)))
            .peek(user -> Optional.of(user)
                .filter(u -> u.getRefreshTokenExpiry().isBefore(LocalDateTime.now()))
                .ifPresent(u -> {
                    userRepository.save(u.withClearedRefreshToken());
                    throw new UnauthorizedException(AuthConstants.MSG_EXPIRED_REFRESH_TOKEN);
                }))
            .map(user -> {
                String newAccessToken = jwtTokenProvider.generateAccessToken(user);
                String newRefreshToken = UUID.randomUUID().toString();
                LocalDateTime refreshExpiry = LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRATION_DAYS);
                userRepository.save(user.withRefreshToken(newRefreshToken, refreshExpiry));
                return new RefreshTokenResponse(newAccessToken, newRefreshToken);
            })
            .get();
    }
}
