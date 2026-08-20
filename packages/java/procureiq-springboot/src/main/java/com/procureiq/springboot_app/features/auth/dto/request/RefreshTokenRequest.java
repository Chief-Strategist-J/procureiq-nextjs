package com.procureiq.springboot_app.features.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token cannot be blank")
    private String refreshToken = "";

    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken != null ? refreshToken : "";
    }

    public String getRefreshToken() {
        return refreshToken != null ? refreshToken : "";
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken != null ? refreshToken : "";
    }
}
