package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LogoutCommandHandler implements AuthCommandHandler<String, Void> {

    private final UserRepository userRepository;

    public LogoutCommandHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.LOGOUT;
    }

    @Override
    public Void execute(String refreshToken) {
        return AuthPipeline.of(refreshToken)
            .map(token -> Optional.ofNullable(token).map(String::trim).filter(t -> !t.isEmpty()).orElse(""))
            .peek(token -> {
                if (!token.isEmpty()) {
                    userRepository.findByRefreshToken(token).ifPresent(u -> userRepository.save(u.withClearedRefreshToken()));
                }
            })
            .executeVoid();
    }
}
