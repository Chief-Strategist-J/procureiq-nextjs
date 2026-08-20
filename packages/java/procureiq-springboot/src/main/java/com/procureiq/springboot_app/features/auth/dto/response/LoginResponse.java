package com.procureiq.springboot_app.features.auth.dto.response;

public class LoginResponse {
    private String token = "";
    private String refreshToken = "";
    private UserResponse user = new UserResponse();

    public LoginResponse() {}

    public LoginResponse(String token, UserResponse user) {
        this.token = token != null ? token : "";
        this.refreshToken = "";
        this.user = user != null ? user : new UserResponse();
    }

    public LoginResponse(String token, String refreshToken, UserResponse user) {
        this.token = token != null ? token : "";
        this.refreshToken = refreshToken != null ? refreshToken : "";
        this.user = user != null ? user : new UserResponse();
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

    public UserResponse getUser() {
        return user != null ? user : new UserResponse();
    }

    public void setUser(UserResponse user) {
        this.user = user != null ? user : new UserResponse();
    }
}
