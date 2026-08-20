package com.procureiq.springboot_app.infra.config;

public final class ApiEndpoints {
    public static final String API_V1 = "/api/v1";
    public static final String AUTH = API_V1 + "/auth";
    public static final String IDENTITY = API_V1 + "/identity";

    public static final String PATH_ID = "/{id}";
    public static final String SIGNUP = "/signup";
    public static final String LOGIN = "/login";
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";
    public static final String VERIFY_EMAIL = "/verify-email";
    public static final String LOGOUT = "/logout";
    public static final String REFRESH_TOKEN = "/refresh";

    public static final String IDENTITY_ORGANIZATIONS = "/organizations";
    public static final String IDENTITY_ASSIGNMENTS = "/organizations/{orgId}/assignments";
    public static final String IDENTITY_AUDIT_EVENTS = "/organizations/{orgId}/audit-events";
    public static final String IDENTITY_AUDIT_EVENTS_VERIFY = "/organizations/{orgId}/audit-events/verify";

    public static final String TVM = API_V1 + "/tvm";
    public static final String TVM_CALCULATE = "/calculate";
    public static final String TVM_TIMESFM_FORECAST = "/timesfm-forecast";

    public static final String TVM_AI = API_V1 + "/tvm-ai";
    public static final String TVM_AI_FORECAST = "/forecast";

    private ApiEndpoints() {}
}
