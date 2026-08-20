package com.procureiq.springboot_app.features.auth.dto.response;

public class RefreshTokenResponse {
    private String token = "";
    private String refreshToken = "";

    public RefreshTokenResponse() {}

    public RefreshTokenResponse(String token, String refreshToken) {
        this.token = token != null ? token : "";
        this.refreshToken = refreshToken != null ? refreshToken : "";
    }

    public String getToken() {
        return token != null ? token : "";
    }

    public void setToken(String token) {
        this.token = token != null ? token : "";
    }

    public String getRefreshToken() {
        return refreshToken != null ? refreshToken : "";
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken != null ? refreshToken : "";
    }
}
