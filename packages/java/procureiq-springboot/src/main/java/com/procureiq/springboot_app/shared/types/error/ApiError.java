package com.procureiq.springboot_app.shared.types.error;

public class ApiError {
    private final String message;

    public ApiError() {
        this.message = "";
    }

    public ApiError(final String message) {
        this.message = message != null ? message : "";
    }

    public String getMessage() {
        return message;
    }
}
