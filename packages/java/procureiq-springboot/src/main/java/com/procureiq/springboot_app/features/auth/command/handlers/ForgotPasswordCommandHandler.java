package com.procureiq.springboot_app.features.auth.command.handlers;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.constants.AuthConstants;
import com.procureiq.springboot_app.features.auth.dto.request.ForgotPasswordRequest;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.infra.config.AppProperties;
import com.procureiq.springboot_app.shared.exceptions.ResourceNotFoundException;
import com.procureiq.springboot_app.shared.pipeline.AuthPipeline;
import com.procureiq.springboot_app.shared.ports.NotificationSender;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class ForgotPasswordCommandHandler implements AuthCommandHandler<ForgotPasswordRequest, Void> {

    private final UserRepository userRepository;
    private final String resetPasswordUrlBase;
    private final NotificationSender notificationSender;

    public ForgotPasswordCommandHandler(
            UserRepository userRepository,
            AppProperties appProperties,
            NotificationSender notificationSender) {
        this.userRepository = userRepository;
        this.resetPasswordUrlBase = appProperties.getResetPasswordUrlBase();
        this.notificationSender = notificationSender;
    }

    @Override
    public AuthAction getAction() {
        return AuthAction.FORGOT_PASSWORD;
    }

    @Override
    public Void execute(ForgotPasswordRequest request) {
        return AuthPipeline.of(request)
            .map(req -> userRepository.findByEmail(req.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException(AuthConstants.MSG_USER_NOT_FOUND_EMAIL + req.getEmail().trim())))
            .peek(user -> {
                String token = UUID.randomUUID().toString();
                LocalDateTime resetExpiry = LocalDateTime.now().plusHours(1);
                userRepository.save(user.withResetToken(token, resetExpiry));

                String resetLink = resetPasswordUrlBase + token;
                String emailBody = buildPasswordResetEmailBody(resetLink);

                try {
                    notificationSender.send(
                        AuthConstants.NOTIFICATION_CHANNEL_EMAIL,
                        AuthConstants.NOTIFICATION_PROVIDER_SMTP,
                        user.getEmail(),
                        AuthConstants.NOTIFICATION_SUBJECT_RESET_PWD,
                        emailBody
                    );
                } catch (Exception e) {
                    userRepository.save(user.withClearedResetToken());
                    throw new IllegalStateException(AuthConstants.MSG_SMTP_FAILED, e);
                }
            })
            .executeVoid();
    }

    private String buildPasswordResetEmailBody(String resetLink) {
        return "Hello,\n\nYou requested to reset your password. Click the link below to reset it:\n"
                + resetLink + "\n\nThis link will expire in 1 hour.\n\nBest regards,\nProcureIQ Team";
    }
}
