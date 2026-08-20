package com.procureiq.springboot_app.features.auth.dto.response;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class UserResponse {
    private Long id = 0L;
    private String tenantId = "default";
    private String username = "";
    private String email = "";
    private String role = "user";
    private List<String> roles = List.of("user");

    public UserResponse() {}

    public UserResponse(Long id, String username, String email) {
        this.id = id != null ? id : 0L;
        this.username = username != null ? username : "";
        this.email = email != null ? email : "";
        this.role = "user";
        this.tenantId = "default";
        this.roles = List.of("user");
    }

    public UserResponse(Long id, String username, String email, String role) {
        this.id = id != null ? id : 0L;
        this.username = username != null ? username : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = "default";
        this.roles = parseRoles(this.role);
    }

    public UserResponse(Long id, String username, String email, String role, String tenantId) {
        this.id = id != null ? id : 0L;
        this.username = username != null ? username : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = tenantId != null ? tenantId : "default";
        this.roles = parseRoles(this.role);
    }

    private static List<String> parseRoles(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return List.of("user");
        }
        return Arrays.stream(roleStr.split(","))
            .map(String::trim)
            .filter(r -> !r.isEmpty())
            .collect(Collectors.toList());
    }

    public String getTenantId() {
        return tenantId != null ? tenantId : "default";
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId != null ? tenantId : "default";
    }

    public List<String> getRoles() {
        return roles != null ? roles : List.of("user");
    }

    public void setRoles(List<String> roles) {
        this.roles = roles != null ? roles : List.of("user");
    }

    public Long getId() {
        return id != null ? id : 0L;
    }

    public void setId(Long id) {
        this.id = id != null ? id : 0L;
    }

    public String getUsername() {
        return username != null ? username : "";
    }

    public void setUsername(String username) {
        this.username = username != null ? username : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email : "";
    }

    public String getRole() {
        return role != null ? role : "user";
    }

    public void setRole(String role) {
        this.role = role != null ? role : "user";
        this.roles = parseRoles(this.role);
    }
}
