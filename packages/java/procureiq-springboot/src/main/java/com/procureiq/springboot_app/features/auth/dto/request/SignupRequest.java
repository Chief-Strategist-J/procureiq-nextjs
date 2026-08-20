package com.procureiq.springboot_app.features.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.HashMap;
import java.util.Map;

public class SignupRequest {

    @JsonAlias({"name", "username"})
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username = "";

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password = "";

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email address format")
    private String email = "";

    @NotBlank(message = "Tenant ID cannot be blank")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Tenant ID must contain only alphanumeric characters, hyphens, or underscores")
    @JsonAlias({"tenant_id", "tenantId", "organizationId"})
    private String tenantId = "default";

    private String companyName = "";
    private String role = "user";
    private Map<String, Object> roleMetadata = new HashMap<>();

    public SignupRequest() {}

    public SignupRequest(String username, String password, String email) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.tenantId = "default";
        this.role = "user";
        this.roleMetadata = new HashMap<>();
    }

    public SignupRequest(String username, String password, String email, String role) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = "default";
        this.roleMetadata = new HashMap<>();
    }

    public SignupRequest(String username, String password, String email, String role, Map<String, Object> roleMetadata) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = "default";
        this.roleMetadata = roleMetadata != null ? roleMetadata : new HashMap<>();
    }

    public SignupRequest(String username, String password, String email, String role, Map<String, Object> roleMetadata, String tenantId) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = tenantId != null ? tenantId : "default";
        this.roleMetadata = roleMetadata != null ? roleMetadata : new HashMap<>();
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

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email : "";
    }

    public String getCompanyName() {
        return companyName != null ? companyName : "";
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName != null ? companyName : "";
    }

    public String getRole() {
        return role != null ? role : "user";
    }

    public void setRole(String role) {
        this.role = role != null ? role : "user";
    }

    public Map<String, Object> getRoleMetadata() {
        return roleMetadata != null ? roleMetadata : new HashMap<>();
    }

    public void setRoleMetadata(Map<String, Object> roleMetadata) {
        this.roleMetadata = roleMetadata != null ? roleMetadata : new HashMap<>();
    }
}
