package com.procureiq.springboot_app.shared.types.single;

import com.procureiq.springboot_app.shared.types.error.ApiError;

public class ApiSingleResponse<T> {
    private final String status;
    private final int code;
    private final T data;
    private final ApiError error;

    public ApiSingleResponse() {
        this.status = "success";
        this.code = 200;
        this.data = null;
        this.error = null;
    }

    public ApiSingleResponse(final String status, final int code, final T data, final ApiError error) {
        this.status = status != null ? status : "success";
        this.code = code;
        this.data = data;
        this.error = error;
    }

    public static <T> ApiSingleResponse<T> success(final int code, final T data) {
        return new ApiSingleResponse<>("success", code, data, null);
    }

    public static <T> ApiSingleResponse<T> error(final int code, final String message) {
        return new ApiSingleResponse<>("error", code, null, new ApiError(message));
    }

    public String getStatus() {
        return status;
    }

    public int getCode() {
        return code;
    }

    public T getData() {
        return data;
    }

    public ApiError getError() {
        return error;
    }
}
