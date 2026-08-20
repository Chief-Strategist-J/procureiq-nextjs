package com.procureiq.springboot_app.features.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public class VerifyEmailRequest {

    @NotBlank(message = "Email cannot be blank")
    private String email = "";

    @NotBlank(message = "Verification token cannot be blank")
    private String token = "";

    public VerifyEmailRequest() {}

    public VerifyEmailRequest(String email, String token) {
        this.email = email != null ? email : "";
        this.token = token != null ? token : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email : "";
    }

    public String getToken() {
        return token != null ? token : "";
    }

    public void setToken(String token) {
        this.token = token != null ? token : "";
    }
}
