--------------------------- MODULE AuthFlow ---------------------------
EXTENDS Integers, Sequences, FiniteSets

CONSTANTS
    Credentials,
    Tokens

VARIABLES
    authState,
    currentUser,
    currentToken,
    lastError,
    networkState

vars == <<authState, currentUser, currentToken, lastError, networkState>>

(* Initial State *)
Init ==
    /\ authState = "idle"
    /\ currentUser = "none"
    /\ currentToken = "none"
    /\ lastError = "none"
    /\ networkState = "online"

(* Actions *)
SubmitLoginRequest(cred) ==
    /\ authState = "idle"
    /\ networkState = "online"
    /\ authState' = "loading"
    /\ lastError' = "none"
    /\ UNCHANGED <<currentUser, currentToken, networkState>>

LoginSuccess(user, token) ==
    /\ authState = "loading"
    /\ authState' = "succeeded"
    /\ currentUser' = user
    /\ currentToken' = token
    /\ lastError' = "none"
    /\ UNCHANGED <<networkState>>

LoginFailure(err) ==
    /\ authState = "loading"
    /\ authState' = "failed"
    /\ currentUser' = "none"
    /\ currentToken' = "none"
    /\ lastError' = err
    /\ UNCHANGED <<networkState>>

UserLogout ==
    /\ authState = "succeeded"
    /\ authState' = "idle"
    /\ currentUser' = "none"
    /\ currentToken' = "none"
    /\ lastError' = "none"
    /\ UNCHANGED <<networkState>>

ResetStatus ==
    /\ authState \in {"succeeded", "failed"}
    /\ authState' = "idle"
    /\ lastError' = "none"
    /\ UNCHANGED <<currentUser, currentToken, networkState>>

SetNetworkDrop ==
    /\ networkState = "online"
    /\ networkState' = "offline"
    /\ UNCHANGED <<authState, currentUser, currentToken, lastError>>

SetNetworkRestore ==
    /\ networkState = "offline"
    /\ networkState' = "online"
    /\ UNCHANGED <<authState, currentUser, currentToken, lastError>>

(* Next State Relation *)
Next ==
    \/ \E c \in Credentials : SubmitLoginRequest(c)
    \/ \E u \in {"adminUser"}, t \in Tokens : LoginSuccess(u, t)
    \/ \E e \in {"InvalidCredentials", "NetworkError"} : LoginFailure(e)
    \/ UserLogout
    \/ ResetStatus
    \/ SetNetworkDrop
    \/ SetNetworkRestore

(* Safety & Type Invariants *)
TypeInvariant ==
    /\ authState \in {"idle", "loading", "succeeded", "failed"}
    /\ networkState \in {"online", "offline"}

AuthSafety ==
    /\ (authState = "succeeded" => (currentUser /= "none" /\ currentToken /= "none"))
    /\ (authState = "failed" => (lastError /= "none"))

AuthLiveness ==
    /\ (authState = "loading" ~> (authState \in {"succeeded", "failed"}))

Spec == Init /\ [][Next]_vars /\ WF_vars(Next)
=============================================================================
