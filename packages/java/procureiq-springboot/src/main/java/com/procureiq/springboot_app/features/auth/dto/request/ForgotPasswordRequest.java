package com.procureiq.springboot_app.features.auth.dto.request;

public class ForgotPasswordRequest {
    private String email = "";

    public ForgotPasswordRequest() {}

    public ForgotPasswordRequest(String email) {
        this.email = email != null ? email : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email : "";
    }
}
