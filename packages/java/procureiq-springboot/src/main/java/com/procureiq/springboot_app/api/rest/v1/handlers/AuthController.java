package com.procureiq.springboot_app.api.rest.v1.handlers;

import com.procureiq.springboot_app.features.auth.dto.request.*;
import com.procureiq.springboot_app.features.auth.dto.response.*;
import com.procureiq.springboot_app.features.auth.service.AuthService;
import com.procureiq.springboot_app.infra.config.ApiEndpoints;
import com.procureiq.springboot_app.infra.config.TracingHelper;
import com.procureiq.springboot_app.shared.types.single.ApiSingleResponse;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Tracer;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(ApiEndpoints.AUTH)
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final Tracer tracer = GlobalOpenTelemetry.getTracer("springboot-app", "1.0.0");

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(ApiEndpoints.SIGNUP)
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            SignupResponse response = authService.signup(request);
            HttpStatus status = response.isAutoLogin() ? HttpStatus.OK : HttpStatus.CREATED;
            int code = response.isAutoLogin() ? 200 : 201;
            return ResponseEntity.status(status).body(ApiSingleResponse.success(code, response));
        });
    }

    @PostMapping(ApiEndpoints.LOGIN)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, response));
        });
    }

    @PostMapping(ApiEndpoints.REFRESH_TOKEN)
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            RefreshTokenResponse response = authService.refreshToken(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, response));
        });
    }

    @PostMapping(ApiEndpoints.LOGOUT)
    public ResponseEntity<?> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            String token = Optional.ofNullable(request)
                .map(RefreshTokenRequest::getRefreshToken)
                .orElse("");
            authService.logout(token);
            return ResponseEntity.ok(ApiSingleResponse.success(200, "Logout successful. Session invalidated."));
        });
    }

    @PostMapping(ApiEndpoints.FORGOT_PASSWORD)
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            authService.forgotPassword(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, "If the email matches an active account, a reset token has been generated."));
        });
    }

    @PostMapping(ApiEndpoints.RESET_PASSWORD)
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            authService.resetPassword(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, "Password has been reset successfully."));
        });
    }

    @PostMapping(ApiEndpoints.VERIFY_EMAIL)
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return TracingHelper.executeWithTracing(() -> {
            authService.verifyEmail(request);
            return ResponseEntity.ok(ApiSingleResponse.success(200, "Email has been verified successfully."));
        });
    }
}
