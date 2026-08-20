package com.procureiq.springboot_app;

import com.procureiq.springboot_app.features.auth.dto.request.*;
import com.procureiq.springboot_app.features.auth.dto.response.*;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.features.auth.service.AuthService;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import com.procureiq.springboot_app.features.tenant.relationship.TenantUserRelationshipRepository;
import com.procureiq.springboot_app.features.tenant.repository.TenantRepository;
import com.procureiq.springboot_app.features.tenant.service.TenantService;
import com.procureiq.springboot_app.infra.config.AppProperties;
import com.procureiq.springboot_app.shared.exceptions.ResourceNotFoundException;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.procureiq.springboot_app.shared.ports.NotificationSender;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private TenantUserRelationshipRepository relationshipRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AppProperties appProperties;

    @Mock
    private NotificationSender notificationSender;

    private AuthService authService;
    private TenantService tenantService;

    @BeforeEach
    public void setup() {
        when(appProperties.getJwtSecret()).thenReturn("test-secret-key-12345");
        when(appProperties.getJwtExpirationMs()).thenReturn(86400000L);
        when(appProperties.getJwtIssuer()).thenReturn("procureiq");

        tenantService = new TenantService(tenantRepository, relationshipRepository);

        com.procureiq.springboot_app.features.auth.service.JwtTokenProvider jwtTokenProvider =
                new com.procureiq.springboot_app.features.auth.service.JwtTokenProvider(appProperties);
        com.procureiq.springboot_app.features.auth.service.UserAccountLockService lockService =
                new com.procureiq.springboot_app.features.auth.service.UserAccountLockService(userRepository, passwordEncoder);
        com.procureiq.springboot_app.features.auth.mapper.UserMapper userMapper =
                new com.procureiq.springboot_app.features.auth.mapper.UserMapper();

        java.util.List<com.procureiq.springboot_app.features.auth.command.AuthCommandHandler<?, ?>> handlers = java.util.List.of(
            new com.procureiq.springboot_app.features.auth.command.handlers.SignupCommandHandler(userRepository, passwordEncoder, jwtTokenProvider, tenantService, userMapper),
            new com.procureiq.springboot_app.features.auth.command.handlers.LoginCommandHandler(userRepository, jwtTokenProvider, lockService, userMapper),
            new com.procureiq.springboot_app.features.auth.command.handlers.RefreshTokenCommandHandler(userRepository, jwtTokenProvider),
            new com.procureiq.springboot_app.features.auth.command.handlers.LogoutCommandHandler(userRepository),
            new com.procureiq.springboot_app.features.auth.command.handlers.ForgotPasswordCommandHandler(userRepository, appProperties, notificationSender),
            new com.procureiq.springboot_app.features.auth.command.handlers.ResetPasswordCommandHandler(userRepository, passwordEncoder),
            new com.procureiq.springboot_app.features.auth.command.handlers.VerifyEmailCommandHandler(userRepository)
        );

        authService = new AuthService(handlers);
    }

    @Test
    public void testSignup_Success() {
        SignupRequest request = new SignupRequest("john_doe", "password123", "john@example.com");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setId(1L);

        when(userRepository.findByEmailAndTenantId(anyString(), anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_pwd");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tenantRepository.findBySlug(anyString())).thenReturn(Optional.of(Tenant.create("default", "Default Tenant")));

        SignupResponse response = authService.signup(request);

        assertNotNull(response);
        assertTrue(response.isAutoLogin());
        assertNotNull(response.getToken());
        assertEquals("john_doe", response.getUser().getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testLogin_Success() {
        LoginRequest request = new LoginRequest("john_doe", "password123");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setId(1L);

        when(userRepository.findByIdentifierAndTenantId(anyString(), anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded_pwd")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(user);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("john_doe", response.getUser().getUsername());
    }

    @Test
    public void testLogin_InvalidCredentials() {
        LoginRequest request = new LoginRequest("john_doe", "wrong_password");

        when(userRepository.findByIdentifierAndTenantId(anyString(), anyString())).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    public void testRefreshToken_Success() {
        RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setId(1L);
        user.setRefreshToken("valid-refresh-token");
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(1));

        when(userRepository.findByRefreshToken("valid-refresh-token")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        RefreshTokenResponse response = authService.refreshToken(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getRefreshToken());
    }

    @Test
    public void testLogout_Success() {
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setRefreshToken("some-token");

        when(userRepository.findByRefreshToken("some-token")).thenReturn(Optional.of(user));

        authService.logout("some-token");

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testForgotPassword_UserExists() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("john@example.com");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.forgotPassword(request);

        verify(notificationSender, times(1)).send(anyString(), anyString(), eq("john@example.com"), anyString(), anyString());
    }

    @Test
    public void testForgotPassword_UserNotFound() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("notfound@example.com");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.forgotPassword(request));
        verify(notificationSender, never()).send(anyString(), anyString(), anyString(), anyString(), anyString());
    }

    @Test
    public void testResetPassword_Success() {
        ResetPasswordRequest request = new ResetPasswordRequest("valid-reset-token", "new_password_123");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setResetToken("valid-reset-token");
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));

        when(userRepository.findByResetToken("valid-reset-token")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new_password_123")).thenReturn("new_encoded_pwd");

        authService.resetPassword(request);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testVerifyEmail_Success() {
        VerifyEmailRequest request = new VerifyEmailRequest("john@example.com", "valid-verification-token");
        User user = new User("john_doe", "encoded_pwd", "john@example.com");
        user.setVerificationToken("valid-verification-token");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.verifyEmail(request);

        verify(userRepository, times(1)).save(any(User.class));
    }
}
