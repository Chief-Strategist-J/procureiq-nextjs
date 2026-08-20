package com.procureiq.springboot_app.features.auth.constants;

public final class AuthConstants {

    private AuthConstants() {}

    public static final String DEFAULT_ROLE = "user";
    public static final String DEFAULT_METADATA_JSON = "{}";
    public static final String DEFAULT_JWT_ISSUER = "procureiq";

    public static final String MSG_TENANT_ID_REQUIRED = "Tenant ID (X-Tenant-ID header or tenantId parameter) is required";
    public static final String MSG_INVALID_TENANT_FORMAT = "Tenant ID must contain only alphanumeric characters, hyphens, or underscores";

    public static final String MSG_USERNAME_REQUIRED = "Username cannot be empty";
    public static final String MSG_EMAIL_REQUIRED = "Email cannot be empty";
    public static final String MSG_PASSWORD_REQUIRED = "Password cannot be empty";
    public static final String MSG_CREDENTIALS_REQUIRED = "Username/email and password cannot be empty";
    public static final String MSG_REFRESH_TOKEN_REQUIRED = "Refresh token cannot be empty";
    public static final String MSG_TOKEN_REQUIRED = "Token cannot be empty";
    public static final String MSG_NEW_PASSWORD_REQUIRED = "New password cannot be empty";
    public static final String MSG_VERIFICATION_TOKEN_REQUIRED = "Verification token cannot be empty";

    public static final String MSG_INVALID_CREDENTIALS = "Invalid username or password";
    public static final String MSG_INVALID_REFRESH_TOKEN = "Invalid or revoked refresh token";
    public static final String MSG_EXPIRED_REFRESH_TOKEN = "Refresh token has expired. Please login again.";
    public static final String MSG_INVALID_RESET_TOKEN = "Invalid or expired reset token";
    public static final String MSG_USER_NOT_FOUND_EMAIL = "User not found with email: ";
    public static final String MSG_USER_EXISTS = "An account with this email address already exists. Please sign in with your credentials.";
    public static final String MSG_ACCOUNT_LOCKED = "Account is temporarily locked due to multiple failed login attempts. Please try again later.";
    public static final String MSG_SMTP_FAILED = "Failed to send password reset email via SMTP";

    public static final String NOTIFICATION_CHANNEL_EMAIL = "email";
    public static final String NOTIFICATION_PROVIDER_SMTP = "smtp";
    public static final String NOTIFICATION_SUBJECT_RESET_PWD = "Password Reset Request";
}
