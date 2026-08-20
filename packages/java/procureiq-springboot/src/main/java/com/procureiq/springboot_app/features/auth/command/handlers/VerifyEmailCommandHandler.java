package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.VerifyEmailRequest;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import org.springframework.stereotype.Component;

@Component
public class VerifyEmailCommandHandler implements AuthCommandHandler<VerifyEmailRequest, Void> {

    private final UserRepository userRepository;

    public VerifyEmailCommandHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.VERIFY_EMAIL;
    }

    @Override
    public Void execute(VerifyEmailRequest request) {
        return AuthPipeline.of(request)
            .map(req -> userRepository.findByEmail(req.getEmail().trim())
                .orElseThrow(() -> new IllegalArgumentException(AuthConstants.MSG_USER_NOT_FOUND_EMAIL + req.getEmail().trim())))
            .peek(user -> userRepository.save(user.withEmailVerified()))
            .executeVoid();
    }
}
