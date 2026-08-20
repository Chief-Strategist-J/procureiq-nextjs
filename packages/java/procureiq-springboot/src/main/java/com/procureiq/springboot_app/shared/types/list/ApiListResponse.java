package com.procureiq.springboot_app.shared.types.list;

import com.procureiq.springboot_app.shared.types.error.ApiError;
import java.util.List;

public class ApiListResponse<T> {
    private final String status;
    private final int code;
    private final List<T> data;
    private final ApiError error;
    private final int totalCount;

    public ApiListResponse() {
        this.status = "success";
        this.code = 200;
        this.data = null;
        this.error = null;
        this.totalCount = 0;
    }

    public ApiListResponse(final String status, final int code, final List<T> data, final ApiError error, final int totalCount) {
        this.status = status != null ? status : "success";
        this.code = code;
        this.data = data;
        this.error = error;
        this.totalCount = totalCount;
    }

    public static <T> ApiListResponse<T> success(final int code, final List<T> data) {
        final int count = data != null ? data.size() : 0;
        return new ApiListResponse<>("success", code, data, null, count);
    }

    public static <T> ApiListResponse<T> error(final int code, final String message) {
        return new ApiListResponse<>("error", code, null, new ApiError(message), 0);
    }

    public String getStatus() {
        return status;
    }

    public int getCode() {
        return code;
    }

    public List<T> getData() {
        return data;
    }

    public ApiError getError() {
        return error;
    }

    public int getTotalCount() {
        return totalCount;
    }
}
