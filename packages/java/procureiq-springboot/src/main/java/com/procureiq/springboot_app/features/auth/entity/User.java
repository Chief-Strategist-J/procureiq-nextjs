package com.procureiq.springboot_app.features.auth.entity;

import com.procureiq.springboot_app.shared.tenant.TenantContext;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_email_tenant", columnNames = {"email", "tenant_id"})
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId = "default";

    @Column(nullable = false)
    private String username = "";

    @Column(nullable = false)
    private String password = "";

    @Column(name = "email", nullable = false)
    private String email = "";

    @Column(name = "role", nullable = false)
    private String role = "user";

    @Column(name = "failed_attempt_count")
    private int failedAttemptCount = 0;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;

    @Column(name = "lock_time")
    private LocalDateTime lockTime;

    @Column(name = "refresh_token")
    private String refreshToken = "";

    @Column(name = "refresh_token_expiry")
    private LocalDateTime refreshTokenExpiry = LocalDateTime.of(1970, 1, 1, 0, 0);

    @Column(name = "reset_token")
    private String resetToken = "";

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry = LocalDateTime.of(1970, 1, 1, 0, 0);

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "verification_token")
    private String verificationToken = "";

    @Column(name = "role_metadata", length = 2000)
    private String roleMetadata = "{}";

    public User() {}

    public User(String username, String password, String email) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = "user";
        this.tenantId = TenantContext.getTenantId();
    }

    public User(String username, String password, String email, String role) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = TenantContext.getTenantId();
    }

    public User(String username, String password, String email, String role, String tenantId) {
        this.username = username != null ? username : "";
        this.password = password != null ? password : "";
        this.email = email != null ? email : "";
        this.role = role != null ? role : "user";
        this.tenantId = Optional.ofNullable(tenantId)
            .map(String::trim)
            .map(t -> t.toLowerCase(Locale.ROOT))
            .filter(t -> !t.isEmpty())
            .orElseGet(TenantContext::getTenantId);
    }

    public static User create(String username, String encodedPassword, String email, String role, String roleMetadata, String tenantId) {
        String resolvedTenantId = Optional.ofNullable(tenantId)
            .map(String::trim)
            .map(t -> t.toLowerCase(Locale.ROOT))
            .filter(t -> !t.isEmpty())
            .orElseGet(TenantContext::getTenantId);

        User user = new User(username, encodedPassword, email, role, resolvedTenantId);
        user.setRoleMetadata(roleMetadata != null ? roleMetadata : "{}");
        return user;
    }

    public static User create(String username, String encodedPassword, String email, String role, String roleMetadata) {
        return create(username, encodedPassword, email, role, roleMetadata, TenantContext.getTenantId());
    }

    public List<String> getRolesList() {
        return Arrays.stream(getRole().split(","))
            .map(String::trim)
            .filter(r -> !r.isEmpty())
            .collect(Collectors.toList());
    }

    public boolean hasRole(String roleName) {
        return Optional.ofNullable(roleName)
            .map(String::trim)
            .map(r -> getRolesList().contains(r))
            .orElse(false);
    }

    public User withSuccessfulLogin(String refreshToken, LocalDateTime expiry) {
        this.failedAttemptCount = 0;
        this.accountNonLocked = true;
        this.lockTime = null;
        this.refreshToken = refreshToken != null ? refreshToken : "";
        this.refreshTokenExpiry = expiry != null ? expiry : LocalDateTime.of(1970, 1, 1, 0, 0);
        return this;
    }

    public User withRefreshToken(String refreshToken, LocalDateTime expiry) {
        this.refreshToken = refreshToken != null ? refreshToken : "";
        this.refreshTokenExpiry = expiry != null ? expiry : LocalDateTime.of(1970, 1, 1, 0, 0);
        return this;
    }

    public User withClearedRefreshToken() {
        this.refreshToken = "";
        this.refreshTokenExpiry = LocalDateTime.of(1970, 1, 1, 0, 0);
        return this;
    }

    public User withResetToken(String resetToken, LocalDateTime expiry) {
        this.resetToken = resetToken != null ? resetToken : "";
        this.resetTokenExpiry = expiry != null ? expiry : LocalDateTime.of(1970, 1, 1, 0, 0);
        return this;
    }

    public User withClearedResetToken() {
        this.resetToken = "";
        this.resetTokenExpiry = LocalDateTime.of(1970, 1, 1, 0, 0);
        return this;
    }

    public User withUpdatedPassword(String encodedPassword) {
        this.password = encodedPassword != null ? encodedPassword : "";
        return withClearedResetToken();
    }

    public User withEmailVerified() {
        this.emailVerified = true;
        this.verificationToken = "";
        return this;
    }

    public String getTenantId() {
        return tenantId != null ? tenantId.toLowerCase(Locale.ROOT) : TenantContext.getTenantId();
    }

    public void setTenantId(String tenantId) {
        this.tenantId = Optional.ofNullable(tenantId)
            .map(String::trim)
            .map(t -> t.toLowerCase(Locale.ROOT))
            .filter(t -> !t.isEmpty())
            .orElseGet(TenantContext::getTenantId);
    }

    public String getRoleMetadata() {
        return roleMetadata != null ? roleMetadata : "{}";
    }

    public void setRoleMetadata(String roleMetadata) {
        this.roleMetadata = roleMetadata != null ? roleMetadata : "{}";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRole() {
        return role != null ? role : "user";
    }

    public void setRole(String role) {
        this.role = role != null ? role : "user";
    }

    public int getFailedAttemptCount() {
        return failedAttemptCount;
    }

    public void setFailedAttemptCount(int failedAttemptCount) {
        this.failedAttemptCount = failedAttemptCount;
    }

    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    public LocalDateTime getLockTime() {
        return lockTime;
    }

    public void setLockTime(LocalDateTime lockTime) {
        this.lockTime = lockTime;
    }

    public String getRefreshToken() {
        return refreshToken != null ? refreshToken : "";
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken != null ? refreshToken : "";
    }

    public LocalDateTime getRefreshTokenExpiry() {
        return refreshTokenExpiry != null ? refreshTokenExpiry : LocalDateTime.of(1970, 1, 1, 0, 0);
    }

    public void setRefreshTokenExpiry(LocalDateTime refreshTokenExpiry) {
        this.refreshTokenExpiry = refreshTokenExpiry != null ? refreshTokenExpiry : LocalDateTime.of(1970, 1, 1, 0, 0);
    }

    public String getResetToken() {
        return resetToken != null ? resetToken : "";
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken != null ? resetToken : "";
    }

    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry != null ? resetTokenExpiry : LocalDateTime.of(1970, 1, 1, 0, 0);
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry != null ? resetTokenExpiry : LocalDateTime.of(1970, 1, 1, 0, 0);
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken != null ? verificationToken : "";
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken != null ? verificationToken : "";
    }
}
