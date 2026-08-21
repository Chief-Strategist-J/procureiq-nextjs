package com.procureiq.springboot_app.shared.types.paged;

import org.springframework.data.domain.Page;

import java.util.List;

public class ApiPagedResponse<T> {

    private final String status;
    private final int code;
    private final List<T> data;
    private final long totalElements;
    private final int totalPages;
    private final int currentPage;
    private final int pageSize;

    private ApiPagedResponse(
        String status,
        int code,
        List<T> data,
        long totalElements,
        int totalPages,
        int currentPage,
        int pageSize
    ) {
        this.status = status;
        this.code = code;
        this.data = data;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public static <T> ApiPagedResponse<T> success(int code, Page<T> page) {
        return new ApiPagedResponse<>(
            "success",
            code,
            page.getContent(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.getNumber(),
            page.getSize()
        );
    }

    public String getStatus() { return status; }
    public int getCode() { return code; }
    public List<T> getData() { return data; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
}
