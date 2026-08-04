--------------------------- MODULE AuthFlow ---------------------------
EXTENDS Integers, Sequences, FiniteSets, TLC

CONSTANTS
    Users,                  \* Set of all user IDs e.g. {user1, user2}
    Credentials,            \* Set of valid credential records e.g. {cred1, cred2}
    AccessTokens,           \* Set of valid access token IDs e.g. {at1, at2}
    RefreshTokens,          \* Set of valid refresh token IDs e.g. {rt1, rt2}
    Sessions,               \* Set of session IDs e.g. {sess1, sess2}
    Roles,                  \* Set of roles e.g. {"admin", "manager", "user"}
    Permissions,            \* Set of permissions e.g. {"read", "write", "delete"}
    MaxRetries,             \* Max allowed retries e.g. 3
    MaxSessionsPerUser,     \* Max allowed active sessions per user e.g. 2
    TokenTTL                \* Access token lifespan units e.g. 5

VARIABLES
    (* 1 & 2: Credential & Authentication State *)
    authState,              \* Client Auth state enum
    currentUser,            \* Currently active User ID or "none"
    currentCredentials,     \* Credential payload being processed
    userAccountStatus,      \* Map [u \in Users |-> "active" | "locked" | "disabled" | "password_expired" | "reset_required"]
    userRoles,              \* Map [u \in Users |-> Roles]
    userPermissions,        \* Map [u \in Users |-> SUBSET Permissions]
    
    (* 3 & 4: Token Management *)
    activeAccessToken,     \* Current Access Token ID or "none"
    activeRefreshToken,    \* Current Refresh Token ID or "none"
    revokedTokens,          \* Set of invalidated/revoked tokens
    tokenOwnerMap,          \* Map [t \in AccessTokens \cup RefreshTokens |-> Users \cup {"none"}]
    tokenTTLMap,            \* Map [t \in AccessTokens |-> 0..TokenTTL]
    tokenSessionMap,        \* Map [t \in AccessTokens |-> Sessions \cup {"none"}]

    (* 5 & 6: Retry, Lockout & Rate Limiting *)
    retryCount,             \* Failure counter
    lockoutStatus,          \* "unlocked" | "temp_locked" | "permanently_locked"
    rateLimitStatus,        \* "allowed" | "user_limited" | "ip_limited" | "device_limited"
    captchaTriggered,       \* Boolean

    (* 7 & 8: Network & Backend Reliability *)
    networkChannel,         \* "connected" | "degraded" | "packet_loss" | "disconnected"
    backendServiceStatus,   \* "healthy" | "db_down" | "cache_down" | "auth_service_down" | "500_internal_error"
    backendDbPool,          \* "healthy" | "exhausted"

    (* 9 & 10: Concurrency, Attack Defenses & Security Assumptions *)
    activeSessions,         \* Set of active Session IDs
    userSessions,           \* Map [u \in Users |-> SUBSET Sessions]
    replayAttackDetected,   \* Boolean flag
    sessionFixationGuarded, \* Boolean flag
    csrfTokenValid,         \* Boolean flag

    (* 13: Audit & Observability *)
    auditLogStream          \* Sequence of audit event records

vars == <<
    authState, currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
    activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
    retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
    networkChannel, backendServiceStatus, backendDbPool,
    activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
    auditLogStream
>>

(* Enumerated State Domains *)
AuthStates == {
    "idle", "validating_client", "submitting_request", "backend_validating",
    "authenticated", "refresh_rotating", "token_expired",
    "error_user_not_found", "error_wrong_password", "error_policy_failure",
    "error_locked", "error_disabled", "error_rate_limited", "error_network_timeout",
    "error_backend_500", "error_replay_attack", "logged_out", "forced_logged_out"
}

NetworkStates == {"connected", "degraded", "disconnected"}
BackendStates == {"healthy", "rate_limiting", "unresponsive"}

(* Helper: Log Audit Event *)
LogAuditEvent(eventType, payload) ==
    auditLogStream' = Append(auditLogStream, [type |-> eventType, data |-> payload, time |-> Len(auditLogStream) + 1])

(* Initial State Definition *)
Init ==
    /\ authState = "idle"
    /\ currentUser = "none"
    /\ currentCredentials = "none"
    /\ userAccountStatus = [u \in Users |-> "active"]
    /\ userRoles = [u \in Users |-> "user"]
    /\ userPermissions = [u \in Users |-> {"read"}]
    /\ activeAccessToken = "none"
    /\ activeRefreshToken = "none"
    /\ revokedTokens = {}
    /\ tokenOwnerMap = [t \in (AccessTokens \cup RefreshTokens) |-> "none"]
    /\ tokenTTLMap = [t \in AccessTokens |-> TokenTTL]
    /\ tokenSessionMap = [t \in AccessTokens |-> "none"]
    /\ retryCount = 0
    /\ lockoutStatus = "unlocked"
    /\ rateLimitStatus = "allowed"
    /\ captchaTriggered = FALSE
    /\ networkChannel = "connected"
    /\ backendServiceStatus = "healthy"
    /\ backendDbPool = "healthy"
    /\ activeSessions = {}
    /\ userSessions = [u \in Users |-> {}]
    /\ replayAttackDetected = FALSE
    /\ sessionFixationGuarded = TRUE
    /\ csrfTokenValid = TRUE
    /\ auditLogStream = << >>

(* -------------------------------------------------------------------------- *)
(* PROTOCOL ACTIONS & TRANSITIONS                                              *)
(* -------------------------------------------------------------------------- *)

(* Action 1: Client Credential Submission *)
ClientSubmit(cred) ==
    /\ authState \in {"idle", "logged_out", "error_wrong_password", "error_network_timeout"}
    /\ lockoutStatus /= "permanently_locked"
    /\ authState' = "validating_client"
    /\ currentCredentials' = cred
    /\ UNCHANGED <<
        currentUser, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
        auditLogStream
       >>

(* Action 2: Client Validation Failure *)
ClientValidationFailure ==
    /\ authState = "validating_client"
    /\ currentCredentials = "none"
    /\ authState' = "idle"
    /\ LogAuditEvent("CLIENT_VALIDATION_FAILED", "invalid_credentials")
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 3: Transmit Request over Wire *)
TransmitAuthRequest ==
    /\ authState = "validating_client"
    /\ currentCredentials /= "none"
    /\ networkChannel = "connected"
    /\ authState' = "backend_validating"
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
        auditLogStream
       >>

(* Action 4: Backend Credential Authentication & Session Grant *)
BackendAuthenticateSuccess(u, at, rt, sess) ==
    /\ authState = "backend_validating"
    /\ backendServiceStatus = "healthy"
    /\ userAccountStatus[u] = "active"
    /\ lockoutStatus = "unlocked"
    /\ rateLimitStatus = "allowed"
    /\ Cardinality(userSessions[u]) < MaxSessionsPerUser
    /\ at \notin revokedTokens
    /\ rt \notin revokedTokens
    /\ authState' = "authenticated"
    /\ currentUser' = u
    /\ activeAccessToken' = at
    /\ activeRefreshToken' = rt
    /\ tokenOwnerMap' = [tokenOwnerMap EXCEPT ![at] = u, ![rt] = u]
    /\ tokenTTLMap' = [tokenTTLMap EXCEPT ![at] = TokenTTL]
    /\ tokenSessionMap' = [tokenSessionMap EXCEPT ![at] = sess]
    /\ activeSessions' = activeSessions \cup {sess}
    /\ userSessions' = [userSessions EXCEPT ![u] = userSessions[u] \cup {sess}]
    /\ retryCount' = 0
    /\ captchaTriggered' = FALSE
    /\ LogAuditEvent("LOGIN_SUCCESS", [user |-> u, token |-> at, session |-> sess])
    /\ UNCHANGED <<
        currentCredentials, userAccountStatus, userRoles, userPermissions,
        revokedTokens, lockoutStatus, rateLimitStatus,
        networkChannel, backendServiceStatus, backendDbPool,
        replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 5: Backend Rejects - Wrong Password & Lockout Escalation *)
BackendRejectWrongPassword ==
    /\ authState = "backend_validating"
    /\ backendServiceStatus = "healthy"
    /\ authState' = "error_wrong_password"
    /\ retryCount' = IF retryCount < MaxRetries THEN retryCount + 1 ELSE retryCount
    /\ lockoutStatus' = IF retryCount + 1 >= MaxRetries THEN "temp_locked" ELSE lockoutStatus
    /\ captchaTriggered' = IF retryCount + 1 >= 2 THEN TRUE ELSE captchaTriggered
    /\ LogAuditEvent("LOGIN_FAILURE_WRONG_PASSWORD", [retries |-> retryCount + 1])
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        rateLimitStatus, networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 6: Backend Rejects - Account Locked or Disabled *)
BackendRejectAccountLocked ==
    /\ authState = "backend_validating"
    /\ ((currentUser /= "none" /\ userAccountStatus[currentUser] = "locked") \/ lockoutStatus = "temp_locked")
    /\ authState' = "error_locked"
    /\ LogAuditEvent("LOGIN_REJECTED_ACCOUNT_LOCKED", [user |-> currentUser])
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 7: Refresh Token Rotation & Replay Protection *)
RotateRefreshTokenPair(oldRt, newAt, newRt) ==
    /\ authState \in {"authenticated", "token_expired"}
    /\ oldRt = activeRefreshToken
    /\ newAt /= activeAccessToken
    /\ newRt /= oldRt
    /\ oldRt \notin revokedTokens
    /\ newAt \notin revokedTokens
    /\ newRt \notin revokedTokens
    /\ authState' = "authenticated"
    /\ activeAccessToken' = newAt
    /\ activeRefreshToken' = newRt
    /\ revokedTokens' = revokedTokens \cup {oldRt, activeAccessToken}
    /\ tokenOwnerMap' = [tokenOwnerMap EXCEPT ![newAt] = currentUser, ![newRt] = currentUser]
    /\ tokenTTLMap' = [tokenTTLMap EXCEPT ![newAt] = TokenTTL]
    /\ LogAuditEvent("REFRESH_TOKEN_ROTATED", [oldToken |-> oldRt, newToken |-> newRt])
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        tokenSessionMap, retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 8: Security Edge Case - Refresh Token Replay Detection *)
DetectRefreshTokenReplay(replayedRt) ==
    /\ replayedRt \in revokedTokens
    /\ replayedRt = activeRefreshToken
    /\ authState' = "error_replay_attack"
    /\ replayAttackDetected' = TRUE
    /\ revokedTokens' = revokedTokens \cup {activeAccessToken, activeRefreshToken}
    /\ activeAccessToken' = "none"
    /\ activeRefreshToken' = "none"
    /\ currentUser' = "none"
    /\ activeSessions' = {}
    /\ LogAuditEvent("SECURITY_ALERT_REFRESH_REPLAY_ATTACK", [replayedToken |-> replayedRt])
    /\ UNCHANGED <<
        currentCredentials, userAccountStatus, userRoles, userPermissions,
        tokenOwnerMap, tokenTTLMap, tokenSessionMap, retryCount, lockoutStatus, rateLimitStatus,
        captchaTriggered, networkChannel, backendServiceStatus, backendDbPool,
        userSessions, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 9: User Explicit & Forced Logout *)
UserLogoutAction(sess) ==
    /\ authState \in {"authenticated", "token_expired", "refresh_rotating"}
    /\ sess \in activeSessions
    /\ currentUser /= "none"
    /\ authState' = "logged_out"
    /\ activeSessions' = activeSessions \ {sess}
    /\ userSessions' = [userSessions EXCEPT ![currentUser] = userSessions[currentUser] \ {sess}]
    /\ revokedTokens' = revokedTokens \cup {activeAccessToken, activeRefreshToken}
    /\ activeAccessToken' = "none"
    /\ activeRefreshToken' = "none"
    /\ currentUser' = "none"
    /\ LogAuditEvent("LOGOUT_EVENT", [session |-> sess])
    /\ UNCHANGED <<
        currentCredentials, userAccountStatus, userRoles, userPermissions,
        tokenOwnerMap, tokenTTLMap, tokenSessionMap, retryCount, lockoutStatus, rateLimitStatus,
        captchaTriggered, networkChannel, backendServiceStatus, backendDbPool,
        replayAttackDetected, sessionFixationGuarded, csrfTokenValid
       >>

(* Action 10: Access Token Expiration Tick *)
AccessTokenTtlTick ==
    /\ authState = "authenticated"
    /\ activeAccessToken /= "none"
    /\ tokenTTLMap[activeAccessToken] > 0
    /\ tokenTTLMap' = [tokenTTLMap EXCEPT ![activeAccessToken] = tokenTTLMap[activeAccessToken] - 1]
    /\ authState' = IF tokenTTLMap[activeAccessToken] - 1 = 0 THEN "token_expired" ELSE "authenticated"
    /\ UNCHANGED <<
        currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        networkChannel, backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
        auditLogStream
       >>

(* Action 11: Network Fault Injections & Recovery *)
SimulateNetworkDrop ==
    /\ networkChannel = "connected"
    /\ networkChannel' = "disconnected"
    /\ UNCHANGED <<
        authState, currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
        auditLogStream
       >>

SimulateNetworkRestore ==
    /\ networkChannel = "disconnected"
    /\ networkChannel' = "connected"
    /\ UNCHANGED <<
        authState, currentUser, currentCredentials, userAccountStatus, userRoles, userPermissions,
        activeAccessToken, activeRefreshToken, revokedTokens, tokenOwnerMap, tokenTTLMap, tokenSessionMap,
        retryCount, lockoutStatus, rateLimitStatus, captchaTriggered,
        backendServiceStatus, backendDbPool,
        activeSessions, userSessions, replayAttackDetected, sessionFixationGuarded, csrfTokenValid,
        auditLogStream
       >>

(* -------------------------------------------------------------------------- *)
(* NEXT STATE RELATION                                                        *)
(* -------------------------------------------------------------------------- *)
Next ==
    \/ \E c \in Credentials : ClientSubmit(c)
    \/ ClientValidationFailure
    \/ TransmitAuthRequest
    \/ \E u \in Users, at \in AccessTokens, rt \in RefreshTokens, sess \in Sessions : BackendAuthenticateSuccess(u, at, rt, sess)
    \/ BackendRejectWrongPassword
    \/ BackendRejectAccountLocked
    \/ \E oldRt \in RefreshTokens, newAt \in AccessTokens, newRt \in RefreshTokens : RotateRefreshTokenPair(oldRt, newAt, newRt)
    \/ \E rt \in RefreshTokens : DetectRefreshTokenReplay(rt)
    \/ \E sess \in Sessions : UserLogoutAction(sess)
    \/ AccessTokenTtlTick
    \/ SimulateNetworkDrop
    \/ SimulateNetworkRestore

(* -------------------------------------------------------------------------- *)
(* FORMAL INVARIANTS (TLA+)                                                   *)
(* -------------------------------------------------------------------------- *)

(* 1. Type Invariant *)
TypeInvariant ==
    /\ authState \in AuthStates
    /\ networkChannel \in NetworkStates
    /\ backendServiceStatus \in BackendStates
    /\ retryCount \in 0..MaxRetries
    /\ lockoutStatus \in {"unlocked", "temp_locked", "permanently_locked"}

(* 2. Authenticated State Implies Valid Token & User *)
AuthenticatedImpliesValidTokenAndUser ==
    (authState = "authenticated") => (currentUser \in Users /\ activeAccessToken \in AccessTokens /\ activeRefreshToken \in RefreshTokens)

(* 3. Logged-Out Users Have No Valid Token *)
LoggedOutUsersHaveNoValidToken ==
    (authState \in {"logged_out", "error_unauthorized", "error_replay_attack"}) => (activeAccessToken = "none" /\ activeRefreshToken = "none" /\ currentUser = "none")

(* 4. Revoked Tokens Never Authenticate *)
RevokedTokensNeverAuthenticate ==
    (activeAccessToken \in revokedTokens) => (authState /= "authenticated")

(* 5. Retry Count Bounds Invariant *)
RetryCountBounded ==
    retryCount <= MaxRetries

(* 6. Token Rotation Invalidates Previous Token *)
TokenRotationInvalidatesPreviousToken ==
    (authState = "authenticated" /\ activeRefreshToken /= "none") => (activeRefreshToken \notin revokedTokens)

(* 7. Session Always Has Owner *)
SessionAlwaysHasOwner ==
    \A s \in activeSessions : \E u \in Users : s \in userSessions[u]

(* Combined Safety Invariant *)
AuthSafetyInvariant ==
    /\ TypeInvariant
    /\ AuthenticatedImpliesValidTokenAndUser
    /\ LoggedOutUsersHaveNoValidToken
    /\ RevokedTokensNeverAuthenticate
    /\ RetryCountBounded
    /\ TokenRotationInvalidatesPreviousToken
    /\ SessionAlwaysHasOwner

Spec == Init /\ [][Next]_vars /\ WF_vars(Next)
=============================================================================
