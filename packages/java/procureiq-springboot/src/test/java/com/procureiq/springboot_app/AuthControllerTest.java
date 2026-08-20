package com.procureiq.springboot_app;

import tools.jackson.databind.json.JsonMapper;
import com.procureiq.springboot_app.api.rest.v1.handlers.AuthController;
import com.procureiq.springboot_app.features.auth.dto.request.*;
import com.procureiq.springboot_app.features.auth.dto.response.*;
import com.procureiq.springboot_app.features.auth.service.AuthService;
import com.procureiq.springboot_app.shared.exceptions.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private final JsonMapper objectMapper = new JsonMapper();

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    public void testSignupSuccess() throws Exception {
        SignupRequest request = new SignupRequest("devuser", "password123", "dev@example.com");
        UserResponse userResponse = new UserResponse(1L, "devuser", "dev@example.com", "user");
        SignupResponse response = new SignupResponse(userResponse, "mock-access-token", false);

        when(authService.signup(any(SignupRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.user.id", is(1)))
                .andExpect(jsonPath("$.data.user.username", is("devuser")))
                .andExpect(jsonPath("$.data.user.email", is("dev@example.com")));
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginRequest login = new LoginRequest("loginuser", "password123");
        UserResponse userResponse = new UserResponse(1L, "loginuser", "login@example.com", "user");
        LoginResponse response = new LoginResponse("mock-jwt-token", "mock-refresh-token", userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token", is("mock-jwt-token")))
                .andExpect(jsonPath("$.data.refreshToken", is("mock-refresh-token")))
                .andExpect(jsonPath("$.data.user.username", is("loginuser")));
    }

    @Test
    public void testRefreshTokenSuccess() throws Exception {
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest("valid-refresh-token");
        RefreshTokenResponse response = new RefreshTokenResponse("new-jwt-token", "new-refresh-token");

        when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token", is("new-jwt-token")))
                .andExpect(jsonPath("$.data.refreshToken", is("new-refresh-token")));
    }

    @Test
    public void testLogoutSuccess() throws Exception {
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest("valid-refresh-token");
        doNothing().when(authService).logout(any(String.class));

        mockMvc.perform(post("/api/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginInvalidCredentials() throws Exception {
        LoginRequest login = new LoginRequest("nonexistent", "wrongpass");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new UnauthorizedException("Invalid username or password"));

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testForgotPasswordSuccess() throws Exception {
        ForgotPasswordRequest forgot = new ForgotPasswordRequest("reset@example.com");

        doNothing().when(authService).forgotPassword(any(ForgotPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(forgot)))
                .andExpect(status().isOk());
    }

    @Test
    public void testResetPasswordSuccess() throws Exception {
        ResetPasswordRequest reset = new ResetPasswordRequest("token_123", "newpassword123");

        doNothing().when(authService).resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reset)))
                .andExpect(status().isOk());
    }

    @Test
    public void testVerifyEmailSuccess() throws Exception {
        VerifyEmailRequest verify = new VerifyEmailRequest("verify@example.com", "token_12345");

        doNothing().when(authService).verifyEmail(any(VerifyEmailRequest.class));

        mockMvc.perform(post("/api/v1/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", is("Email has been verified successfully.")));
    }

    @Test
    public void testVerifyEmailUserNotFound() throws Exception {
        VerifyEmailRequest verify = new VerifyEmailRequest("nonexistent@example.com", "token_12345");

        doThrow(new IllegalArgumentException("User not found for provided email"))
                .when(authService).verifyEmail(any(VerifyEmailRequest.class));

        mockMvc.perform(post("/api/v1/auth/verify-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verify)))
                .andExpect(status().isNotFound());
    }
}
