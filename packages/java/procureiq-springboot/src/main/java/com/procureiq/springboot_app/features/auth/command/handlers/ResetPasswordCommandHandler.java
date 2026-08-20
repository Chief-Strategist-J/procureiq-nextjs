package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.ResetPasswordRequest;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ResetPasswordCommandHandler implements AuthCommandHandler<ResetPasswordRequest, Void> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResetPasswordCommandHandler(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.RESET_PASSWORD;
    }

    @Override
    public Void execute(ResetPasswordRequest request) {
        return AuthPipeline.of(request)
            .map(req -> userRepository.findByResetToken(req.getToken().trim())
                .filter(u -> !u.getResetTokenExpiry().isBefore(LocalDateTime.now()))
                .orElseThrow(() -> new UnauthorizedException(AuthConstants.MSG_INVALID_RESET_TOKEN)))
            .peek(user -> userRepository.save(user.withUpdatedPassword(passwordEncoder.encode(request.getNewPassword().trim()))))
            .executeVoid();
    }
}
