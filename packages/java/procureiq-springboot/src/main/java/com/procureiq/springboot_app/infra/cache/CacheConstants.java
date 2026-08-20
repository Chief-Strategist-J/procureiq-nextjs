package com.procureiq.springboot_app.infra.cache;

public final class CacheConstants {
    public static final String CACHE_USER_ROLE_ASSIGNMENTS = "user_role_assignments";
    public static final String CACHE_ORG_METADATA = "org_metadata";
    public static final String CACHE_ORG_AUDIT_EVENTS = "org_audit_events";
    public static final String CACHE_USER_PROFILE = "user_profile";
    public static final String CACHE_SECURITY_VERIFICATION = "security_verification";
    public static final String CACHE_SYSTEM_REFERENCE_DATA = "system_reference_data";
    public static final String CACHE_TVM_CALCULATIONS = "tvm_calculations";

    public static final String DEFAULT_PRINCIPAL_TYPE_USER = "user";
    public static final String DEFAULT_ROLE_USER = "user";
    public static final String MSG_ROLE_ASSIGNED_SUCCESS = "Role assigned successfully";

    private CacheConstants() {}
}
