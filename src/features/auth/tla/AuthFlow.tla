--------------------------- MODULE AuthFlow ---------------------------
EXTENDS Integers, Sequences, FiniteSets

CONSTANTS
    Credentials,
    Users,
    Tokens,
    MaxRetries

VARIABLES
    authState,
    currentUser,
    activeToken,
    retryCount,
    networkChannel,
    backendStatus,
    lastError

vars == <<authState, currentUser, activeToken, retryCount, networkChannel, backendStatus, lastError>>

(* Protocol States *)
AuthStates == {
    "idle",
    "validating_client",
    "submitting_request",
    "token_exchanging",
    "authenticated",
    "refresh_rotating",
    "token_expired",
    "error_unauthorized",
    "error_rate_limited",
    "error_network_timeout",
    "logged_out"
}

NetworkStates == {"connected", "degraded", "disconnected"}
BackendStates == {"healthy", "rate_limiting", "unresponsive"}

(* Initial State *)
Init ==
    /\ authState = "idle"
    /\ currentUser = "none"
    /\ activeToken = "none"
    /\ retryCount = 0
    /\ networkChannel = "connected"
    /\ backendStatus = "healthy"
    /\ lastError = "none"

(* Protocol Action 1: Client Inputs Credentials *)
ClientSubmitCredentials(cred) ==
    /\ authState \in {"idle", "logged_out", "error_unauthorized", "error_network_timeout"}
    /\ authState' = "validating_client"
    /\ lastError' = "none"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus>>

(* Protocol Action 2: Client Validation Fails (Edge Case: Malformed Email/Short Password) *)
ClientValidationFailure ==
    /\ authState = "validating_client"
    /\ authState' = "idle"
    /\ lastError' = "CLIENT_VALIDATION_ERROR"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus>>

(* Protocol Action 3: Client Validation Passes -> Transmit Request *)
TransmitAuthRequest ==
    /\ authState = "validating_client"
    /\ networkChannel /= "disconnected"
    /\ authState' = "submitting_request"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus, lastError>>

(* Protocol Action 4: Edge Case - Network Timeout During Request *)
NetworkTimeoutOccurred ==
    /\ authState = "submitting_request"
    /\ networkChannel \in {"degraded", "disconnected"}
    /\ retryCount < MaxRetries
    /\ authState' = "error_network_timeout"
    /\ retryCount' = retryCount + 1
    /\ lastError' = "NETWORK_TIMEOUT"
    /\ UNCHANGED <<currentUser, activeToken, networkChannel, backendStatus>>

(* Protocol Action 5: Edge Case - Backend API Gateway Rate Limits Request (HTTP 429) *)
BackendRateLimitTriggered ==
    /\ authState = "submitting_request"
    /\ backendStatus = "rate_limiting"
    /\ authState' = "error_rate_limited"
    /\ lastError' = "HTTP_429_RATE_LIMITED"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus>>

(* Protocol Action 6: Backend Authenticates Credentials -> Token Exchange *)
BackendTokenGranted(user, token) ==
    /\ authState = "submitting_request"
    /\ backendStatus = "healthy"
    /\ networkChannel = "connected"
    /\ authState' = "authenticated"
    /\ currentUser' = user
    /\ activeToken' = token
    /\ retryCount' = 0
    /\ lastError' = "none"
    /\ UNCHANGED <<networkChannel, backendStatus>>

(* Protocol Action 7: Backend Rejects Credentials (HTTP 401) *)
BackendUnauthorized ==
    /\ authState = "submitting_request"
    /\ authState' = "error_unauthorized"
    /\ currentUser' = "none"
    /\ activeToken' = "none"
    /\ lastError' = "HTTP_401_UNAUTHORIZED"
    /\ UNCHANGED <<retryCount, networkChannel, backendStatus>>

(* Protocol Action 8: Edge Case - Session Token Expiration & Automatic Refresh Rotation *)
SessionTokenExpired ==
    /\ authState = "authenticated"
    /\ authState' = "token_expired"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus, lastError>>

RotateRefreshToken(newToken) ==
    /\ authState = "token_expired"
    /\ networkChannel = "connected"
    /\ authState' = "authenticated"
    /\ activeToken' = newToken
    /\ lastError' = "none"
    /\ UNCHANGED <<currentUser, retryCount, networkChannel, backendStatus>>

(* Protocol Action 9: User Explicit Logout *)
UserLogout ==
    /\ authState \in {"authenticated", "token_expired", "refresh_rotating"}
    /\ authState' = "logged_out"
    /\ currentUser' = "none"
    /\ activeToken' = "none"
    /\ retryCount' = 0
    /\ lastError' = "none"
    /\ UNCHANGED <<networkChannel, backendStatus>>

(* Protocol Action 10: Reset Error State *)
ResetErrorState ==
    /\ authState \in {"error_unauthorized", "error_rate_limited", "error_network_timeout"}
    /\ authState' = "idle"
    /\ lastError' = "none"
    /\ UNCHANGED <<currentUser, activeToken, retryCount, networkChannel, backendStatus>>

(* Environment Network & Backend Transitions *)
ToggleNetwork(status) ==
    /\ status \in NetworkStates
    /\ networkChannel' = status
    /\ UNCHANGED <<authState, currentUser, activeToken, retryCount, backendStatus, lastError>>

ToggleBackendStatus(status) ==
    /\ status \in BackendStates
    /\ backendStatus' = status
    /\ UNCHANGED <<authState, currentUser, activeToken, retryCount, networkChannel, lastError>>

(* Next State Relation *)
Next ==
    \/ \E c \in Credentials : ClientSubmitCredentials(c)
    \/ ClientValidationFailure
    \/ TransmitAuthRequest
    \/ NetworkTimeoutOccurred
    \/ BackendRateLimitTriggered
    \/ \E u \in Users, t \in Tokens : BackendTokenGranted(u, t)
    \/ BackendUnauthorized
    \/ SessionTokenExpired
    \/ \E t \in Tokens : RotateRefreshToken(t)
    \/ UserLogout
    \/ ResetErrorState
    \/ \E s \in NetworkStates : ToggleNetwork(s)
    \/ \E b \in BackendStates : ToggleBackendStatus(b)

(* Safety & Invariant Specifications *)
TypeInvariant ==
    /\ authState \in AuthStates
    /\ networkChannel \in NetworkStates
    /\ backendStatus \in BackendStates
    /\ retryCount \in 0..MaxRetries

AuthSafetyInvariant ==
    /\ (authState = "authenticated" => (currentUser /= "none" /\ activeToken /= "none"))
    /\ (authState \in {"logged_out", "error_unauthorized"} => (activeToken = "none" /\ currentUser = "none"))

NoDeadlock ==
    /\ \E n \in AuthStates : n = authState

Spec == Init /\ [][Next]_vars /\ WF_vars(Next)
=============================================================================
