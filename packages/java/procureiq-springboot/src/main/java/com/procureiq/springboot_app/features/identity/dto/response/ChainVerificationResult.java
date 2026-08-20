package com.procureiq.springboot_app.features.identity.dto.response;

public record ChainVerificationResult(
    boolean isValid,
    Long failedEventId,
    String failedEventAction,
    String message
) {
    public static ChainVerificationResult success() {
        return new ChainVerificationResult(true, null, null, "Integrity chain verified successfully.");
    }

    public static ChainVerificationResult failure(Long eventId, String action, String error) {
        return new ChainVerificationResult(false, eventId, action, error);
    }
}
