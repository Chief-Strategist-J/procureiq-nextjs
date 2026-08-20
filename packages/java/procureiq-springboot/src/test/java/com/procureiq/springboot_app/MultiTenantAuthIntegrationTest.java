package com.procureiq.springboot_app;

import com.procureiq.springboot_app.features.auth.command.AuthCommandHandler;
import com.procureiq.springboot_app.features.auth.command.handlers.*;
import com.procureiq.springboot_app.features.auth.dto.request.LoginRequest;
import com.procureiq.springboot_app.features.auth.dto.request.SignupRequest;
import com.procureiq.springboot_app.features.auth.dto.response.LoginResponse;
import com.procureiq.springboot_app.features.auth.dto.response.SignupResponse;
import com.procureiq.springboot_app.features.auth.entity.User;
import com.procureiq.springboot_app.features.auth.mapper.UserMapper;
import com.procureiq.springboot_app.features.auth.repository.UserRepository;
import com.procureiq.springboot_app.features.auth.service.AuthService;
import com.procureiq.springboot_app.features.auth.service.JwtTokenProvider;
import com.procureiq.springboot_app.features.auth.service.UserAccountLockService;
import com.procureiq.springboot_app.features.tenant.entity.Tenant;
import com.procureiq.springboot_app.features.tenant.relationship.TenantUserRelationshipRepository;
import com.procureiq.springboot_app.features.tenant.repository.TenantRepository;
import com.procureiq.springboot_app.features.tenant.service.TenantService;
import com.procureiq.springboot_app.infra.config.AppProperties;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import com.procureiq.springboot_app.shared.ports.NotificationSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MultiTenantAuthIntegrationTest {

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
    private final Map<String, User> userStorage = new HashMap<>();

    @BeforeEach
    public void setup() {
        when(appProperties.getJwtSecret()).thenReturn("test-multi-tenant-jwt-secret-key-12345");
        when(appProperties.getJwtExpirationMs()).thenReturn(86400000L);
        when(appProperties.getJwtIssuer()).thenReturn("procureiq");

        tenantService = new TenantService(tenantRepository, relationshipRepository);
        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider(appProperties);
        UserAccountLockService lockService = new UserAccountLockService(userRepository, passwordEncoder);
        UserMapper userMapper = new UserMapper();

        List<AuthCommandHandler<?, ?>> handlers = List.of(
            new SignupCommandHandler(userRepository, passwordEncoder, jwtTokenProvider, tenantService, userMapper),
            new LoginCommandHandler(userRepository, jwtTokenProvider, lockService, userMapper),
            new RefreshTokenCommandHandler(userRepository, jwtTokenProvider),
            new LogoutCommandHandler(userRepository),
            new ForgotPasswordCommandHandler(userRepository, appProperties, notificationSender),
            new ResetPasswordCommandHandler(userRepository, passwordEncoder),
            new VerifyEmailCommandHandler(userRepository)
        );

        authService = new AuthService(handlers);
    }

    @Test
    public void testEndToEndMultiTenantSignupAndLoginFlow() {
        // --- TENANT A: acme-corp (Role: Admin) ---
        SignupRequest signupTenantA = new SignupRequest("john_acme", "pass_acme_123", "john@example.com");
        signupTenantA.setTenantId("acme-corp");
        signupTenantA.setCompanyName("Acme Corporation");
        signupTenantA.setRole("admin");

        User userTenantA = new User("john_acme", "encoded_acme_pass", "john@example.com");
        userTenantA.setId(1L);
        userTenantA.setTenantId("acme-corp");
        userTenantA.setRole("admin");

        when(userRepository.findByEmailAndTenantId("john@example.com", "acme-corp")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass_acme_123")).thenReturn("encoded_acme_pass");
        when(userRepository.save(any(User.class))).thenReturn(userTenantA);
        when(tenantRepository.findBySlug("acme-corp")).thenReturn(Optional.of(Tenant.create("acme-corp", "Acme Corporation")));

        SignupResponse signupResponseA = authService.signup(signupTenantA);
        assertNotNull(signupResponseA);
        assertNotNull(signupResponseA.getToken());
        assertEquals("john_acme", signupResponseA.getUser().getUsername());

        // LOGIN TENANT A SUCCESS
        LoginRequest loginTenantA = new LoginRequest("john_acme", "pass_acme_123");
        loginTenantA.setTenantId("acme-corp");

        when(userRepository.findByIdentifierAndTenantId("john_acme", "acme-corp")).thenReturn(Optional.of(userTenantA));
        when(passwordEncoder.matches("pass_acme_123", "encoded_acme_pass")).thenReturn(true);

        LoginResponse loginResponseA = authService.login(loginTenantA);
        assertNotNull(loginResponseA);
        assertNotNull(loginResponseA.getToken());

        // --- TENANT B: globex-inc (Same email, Role: Engineer) ---
        SignupRequest signupTenantB = new SignupRequest("john_globex", "pass_globex_456", "john@example.com");
        signupTenantB.setTenantId("globex-inc");
        signupTenantB.setCompanyName("Globex Inc");
        signupTenantB.setRole("engineer");

        User userTenantB = new User("john_globex", "encoded_globex_pass", "john@example.com");
        userTenantB.setId(2L);
        userTenantB.setTenantId("globex-inc");
        userTenantB.setRole("engineer");

        when(userRepository.findByEmailAndTenantId("john@example.com", "globex-inc")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass_globex_456")).thenReturn("encoded_globex_pass");
        when(userRepository.save(any(User.class))).thenReturn(userTenantB);
        when(tenantRepository.findBySlug("globex-inc")).thenReturn(Optional.of(Tenant.create("globex-inc", "Globex Inc")));

        SignupResponse signupResponseB = authService.signup(signupTenantB);
        assertNotNull(signupResponseB);
        assertNotNull(signupResponseB.getToken());
        assertEquals("john_globex", signupResponseB.getUser().getUsername());

        // LOGIN TENANT B SUCCESS
        LoginRequest loginTenantB = new LoginRequest("john_globex", "pass_globex_456");
        loginTenantB.setTenantId("globex-inc");

        when(userRepository.findByIdentifierAndTenantId("john_globex", "globex-inc")).thenReturn(Optional.of(userTenantB));
        when(passwordEncoder.matches("pass_globex_456", "encoded_globex_pass")).thenReturn(true);

        LoginResponse loginResponseB = authService.login(loginTenantB);
        assertNotNull(loginResponseB);
        assertNotNull(loginResponseB.getToken());

        // --- CROSS-TENANT ISOLATION REJECTION ---
        LoginRequest invalidCrossTenantLogin = new LoginRequest("john_acme", "pass_acme_123");
        invalidCrossTenantLogin.setTenantId("globex-inc"); // Attempting Acme username in Globex tenant

        when(userRepository.findByIdentifierAndTenantId("john_acme", "globex-inc")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(invalidCrossTenantLogin));
    }
}
