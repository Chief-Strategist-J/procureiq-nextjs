package com.procureiq.springboot_app.features.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {

    @JsonAlias({"email", "username", "identifier"})
    @NotBlank(message = "Username cannot be blank")
    private String username = "";

    @NotBlank(message = "Password cannot be blank")
    private String password = "";

    @NotBlank(message = "Tenant ID cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Tenant ID must contain only alphanumeric characters, hyphens, or underscores")
    @JsonAlias({"tenant_id", "tenantId", "organizationId"})
    private String tenantId = "default";

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.tenantId = "default";
    }

    public LoginRequest(String username, String password, String tenantId) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.tenantId = tenantId != null ? tenantId : "default";
    }

    public String getTenantId() {
        return tenantId != null ? tenantId : "default";
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId != null ? tenantId : "default";
    }

    public String getUsername() {
        return username != null ? username : "";
    }

    public void setUsername(String username) {
        this.username = username != null ? username : "";
    }

    public String getPassword() {
        return password != null ? password : "";
    }

    public void setPassword(String password) {
        this.password = password != null ? password : "";
    }
}
