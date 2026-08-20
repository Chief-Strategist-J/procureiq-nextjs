package com.procureiq.springboot_app.features.auth.service;

import com.procureiq.springboot_app.features.auth.command.AuthAction;
import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.dto.request.*;
import com.procureiq.springboot_app.features.auth.dto.response.*;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final Map<AuthAction, AuthCommandHandler<?, ?>> handlerRegistry;

    public AuthService(List<AuthCommandHandler<?, ?>> handlers) {
        this.handlerRegistry = handlers.stream()
            .collect(Collectors.toMap(AuthCommandHandler::getAction, Function.identity()));
    }

    public SignupResponse signup(SignupRequest request) {
        return executeCommand(AuthAction.SIGNUP, request);
    }

    public LoginResponse login(LoginRequest request) {
        return executeCommand(AuthAction.LOGIN, request);
    }

    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        return executeCommand(AuthAction.REFRESH_TOKEN, request);
    }

    public void logout(String refreshToken) {
        executeCommandVoid(AuthAction.LOGOUT, refreshToken);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        executeCommandVoid(AuthAction.FORGOT_PASSWORD, request);
    }

    public void resetPassword(ResetPasswordRequest request) {
        executeCommandVoid(AuthAction.RESET_PASSWORD, request);
    }

    public void verifyEmail(VerifyEmailRequest request) {
        executeCommandVoid(AuthAction.VERIFY_EMAIL, request);
    }

    @SuppressWarnings("unchecked")
    public <C, R> R executeCommand(AuthAction action, C payload) {
        return TracingHelper.executeServiceWithTracing(() -> {
            AuthCommandHandler<C, R> handler = (AuthCommandHandler<C, R>) Optional.ofNullable(handlerRegistry.get(action))
                .orElseThrow(() -> new IllegalArgumentException("Unsupported Auth Action: " + action));
            return handler.execute(payload);
        });
    }

    public <C> void executeCommandVoid(AuthAction action, C payload) {
        TracingHelper.executeServiceVoidWithTracing(() -> {
            executeCommand(action, payload);
        });
    }
}
