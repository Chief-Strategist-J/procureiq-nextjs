package com.procureiq.springboot_app.features.auth.dto.response;

public class SignupResponse {
    private UserResponse user;
    private String token = "";
    private boolean isAutoLogin = false;

    public SignupResponse() {}

    public SignupResponse(UserResponse user, String token, boolean isAutoLogin) {
        this.user = user;
        this.token = token != null ? token : "";
        this.isAutoLogin = isAutoLogin;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token != null ? token : "";
    }

    public void setToken(String token) {
        this.token = token != null ? token : "";
    }

    public boolean isAutoLogin() {
        return isAutoLogin;
    }

    public void setAutoLogin(boolean autoLogin) {
        isAutoLogin = autoLogin;
    }
}
