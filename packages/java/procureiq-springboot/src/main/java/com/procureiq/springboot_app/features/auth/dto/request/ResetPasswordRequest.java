package com.procureiq.springboot_app.features.auth.dto.request;

public class ResetPasswordRequest {
    private String token = "";
    private String newPassword = "";

    public ResetPasswordRequest() {}

    public ResetPasswordRequest(String token, String newPassword) {
        this.token = token != null ? token : "";
        this.newPassword = newPassword != null ? newPassword : "";
    }

    public String getToken() {
        return token != null ? token : "";
    }

    public void setToken(String token) {
        this.token = token != null ? token : "";
    }

    public String getNewPassword() {
        return newPassword != null ? newPassword : "";
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword != null ? newPassword : "";
    }
}
