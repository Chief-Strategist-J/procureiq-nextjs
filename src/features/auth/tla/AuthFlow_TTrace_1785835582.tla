---- MODULE AuthFlow_TTrace_1785835582 ----
EXTENDS Sequences, TLCExt, AuthFlow_TEConstants, AuthFlow, Toolbox, Naturals, TLC

_expression ==
    LET AuthFlow_TEExpression == INSTANCE AuthFlow_TEExpression
    IN AuthFlow_TEExpression!expression
----

_trace ==
    LET AuthFlow_TETrace == INSTANCE AuthFlow_TETrace
    IN AuthFlow_TETrace!trace
----

_inv ==
    ~(
        TLCGet("level") = Len(_TETrace)
        /\
        backendServiceStatus = ("healthy")
        /\
        networkChannel = ("connected")
        /\
        userPermissions = ((user1 :> {"read"} @@ user2 :> {"read"}))
        /\
        backendDbPool = ("healthy")
        /\
        captchaTriggered = (FALSE)
        /\
        lockoutStatus = ("unlocked")
        /\
        tokenTTLMap = ((at1 :> 5 @@ at2 :> 5))
        /\
        tokenOwnerMap = ((at1 :> user1 @@ at2 :> "none" @@ rt1 :> user1 @@ rt2 :> "none"))
        /\
        replayAttackDetected = (FALSE)
        /\
        authState = ("authenticated")
        /\
        currentCredentials = (cred1)
        /\
        retryCount = (0)
        /\
        activeAccessToken = (at1)
        /\
        tokenSessionMap = ((at1 :> sess1 @@ at2 :> "none"))
        /\
        activeRefreshToken = (rt1)
        /\
        sessionFixationGuarded = (TRUE)
        /\
        revokedTokens = ({at1, rt1})
        /\
        userRoles = ((user1 :> "user" @@ user2 :> "user"))
        /\
        rateLimitStatus = ("allowed")
        /\
        currentUser = (user1)
        /\
        userSessions = ((user1 :> {sess1} @@ user2 :> {}))
        /\
        csrfTokenValid = (TRUE)
        /\
        activeSessions = ({sess1})
        /\
        userAccountStatus = ((user1 :> "active" @@ user2 :> "active"))
        /\
        auditLogStream = (<<[type |-> "LOGIN_SUCCESS", data |-> [user |-> user1, token |-> at1, session |-> sess1], time |-> 1], [type |-> "REFRESH_TOKEN_ROTATED", data |-> [oldToken |-> rt1, newToken |-> rt1], time |-> 2]>>)
    )
----

_init ==
    /\ networkChannel = _TETrace[1].networkChannel
    /\ activeAccessToken = _TETrace[1].activeAccessToken
    /\ lockoutStatus = _TETrace[1].lockoutStatus
    /\ tokenTTLMap = _TETrace[1].tokenTTLMap
    /\ currentCredentials = _TETrace[1].currentCredentials
    /\ userPermissions = _TETrace[1].userPermissions
    /\ backendDbPool = _TETrace[1].backendDbPool
    /\ revokedTokens = _TETrace[1].revokedTokens
    /\ tokenOwnerMap = _TETrace[1].tokenOwnerMap
    /\ activeRefreshToken = _TETrace[1].activeRefreshToken
    /\ authState = _TETrace[1].authState
    /\ backendServiceStatus = _TETrace[1].backendServiceStatus
    /\ replayAttackDetected = _TETrace[1].replayAttackDetected
    /\ captchaTriggered = _TETrace[1].captchaTriggered
    /\ activeSessions = _TETrace[1].activeSessions
    /\ csrfTokenValid = _TETrace[1].csrfTokenValid
    /\ currentUser = _TETrace[1].currentUser
    /\ userSessions = _TETrace[1].userSessions
    /\ sessionFixationGuarded = _TETrace[1].sessionFixationGuarded
    /\ auditLogStream = _TETrace[1].auditLogStream
    /\ tokenSessionMap = _TETrace[1].tokenSessionMap
    /\ userRoles = _TETrace[1].userRoles
    /\ rateLimitStatus = _TETrace[1].rateLimitStatus
    /\ retryCount = _TETrace[1].retryCount
    /\ userAccountStatus = _TETrace[1].userAccountStatus
----

_next ==
    /\ \E i,j \in DOMAIN _TETrace:
        /\ \/ /\ j = i + 1
              /\ i = TLCGet("level")
        /\ networkChannel  = _TETrace[i].networkChannel
        /\ networkChannel' = _TETrace[j].networkChannel
        /\ activeAccessToken  = _TETrace[i].activeAccessToken
        /\ activeAccessToken' = _TETrace[j].activeAccessToken
        /\ lockoutStatus  = _TETrace[i].lockoutStatus
        /\ lockoutStatus' = _TETrace[j].lockoutStatus
        /\ tokenTTLMap  = _TETrace[i].tokenTTLMap
        /\ tokenTTLMap' = _TETrace[j].tokenTTLMap
        /\ currentCredentials  = _TETrace[i].currentCredentials
        /\ currentCredentials' = _TETrace[j].currentCredentials
        /\ userPermissions  = _TETrace[i].userPermissions
        /\ userPermissions' = _TETrace[j].userPermissions
        /\ backendDbPool  = _TETrace[i].backendDbPool
        /\ backendDbPool' = _TETrace[j].backendDbPool
        /\ revokedTokens  = _TETrace[i].revokedTokens
        /\ revokedTokens' = _TETrace[j].revokedTokens
        /\ tokenOwnerMap  = _TETrace[i].tokenOwnerMap
        /\ tokenOwnerMap' = _TETrace[j].tokenOwnerMap
        /\ activeRefreshToken  = _TETrace[i].activeRefreshToken
        /\ activeRefreshToken' = _TETrace[j].activeRefreshToken
        /\ authState  = _TETrace[i].authState
        /\ authState' = _TETrace[j].authState
        /\ backendServiceStatus  = _TETrace[i].backendServiceStatus
        /\ backendServiceStatus' = _TETrace[j].backendServiceStatus
        /\ replayAttackDetected  = _TETrace[i].replayAttackDetected
        /\ replayAttackDetected' = _TETrace[j].replayAttackDetected
        /\ captchaTriggered  = _TETrace[i].captchaTriggered
        /\ captchaTriggered' = _TETrace[j].captchaTriggered
        /\ activeSessions  = _TETrace[i].activeSessions
        /\ activeSessions' = _TETrace[j].activeSessions
        /\ csrfTokenValid  = _TETrace[i].csrfTokenValid
        /\ csrfTokenValid' = _TETrace[j].csrfTokenValid
        /\ currentUser  = _TETrace[i].currentUser
        /\ currentUser' = _TETrace[j].currentUser
        /\ userSessions  = _TETrace[i].userSessions
        /\ userSessions' = _TETrace[j].userSessions
        /\ sessionFixationGuarded  = _TETrace[i].sessionFixationGuarded
        /\ sessionFixationGuarded' = _TETrace[j].sessionFixationGuarded
        /\ auditLogStream  = _TETrace[i].auditLogStream
        /\ auditLogStream' = _TETrace[j].auditLogStream
        /\ tokenSessionMap  = _TETrace[i].tokenSessionMap
        /\ tokenSessionMap' = _TETrace[j].tokenSessionMap
        /\ userRoles  = _TETrace[i].userRoles
        /\ userRoles' = _TETrace[j].userRoles
        /\ rateLimitStatus  = _TETrace[i].rateLimitStatus
        /\ rateLimitStatus' = _TETrace[j].rateLimitStatus
        /\ retryCount  = _TETrace[i].retryCount
        /\ retryCount' = _TETrace[j].retryCount
        /\ userAccountStatus  = _TETrace[i].userAccountStatus
        /\ userAccountStatus' = _TETrace[j].userAccountStatus

\* Uncomment the ASSUME below to write the states of the error trace
\* to the given file in Json format. Note that you can pass any tuple
\* to `JsonSerialize`. For example, a sub-sequence of _TETrace.
    \* ASSUME
    \*     LET J == INSTANCE Json
    \*         IN J!JsonSerialize("AuthFlow_TTrace_1785835582.json", _TETrace)

=============================================================================

 Note that you can extract this module `AuthFlow_TEExpression`
  to a dedicated file to reuse `expression` (the module in the 
  dedicated `AuthFlow_TEExpression.tla` file takes precedence 
  over the module `AuthFlow_TEExpression` below).

---- MODULE AuthFlow_TEExpression ----
EXTENDS Sequences, TLCExt, AuthFlow_TEConstants, AuthFlow, Toolbox, Naturals, TLC

expression == 
    [
        \* To hide variables of the `AuthFlow` spec from the error trace,
        \* remove the variables below.  The trace will be written in the order
        \* of the fields of this record.
        networkChannel |-> networkChannel
        ,activeAccessToken |-> activeAccessToken
        ,lockoutStatus |-> lockoutStatus
        ,tokenTTLMap |-> tokenTTLMap
        ,currentCredentials |-> currentCredentials
        ,userPermissions |-> userPermissions
        ,backendDbPool |-> backendDbPool
        ,revokedTokens |-> revokedTokens
        ,tokenOwnerMap |-> tokenOwnerMap
        ,activeRefreshToken |-> activeRefreshToken
        ,authState |-> authState
        ,backendServiceStatus |-> backendServiceStatus
        ,replayAttackDetected |-> replayAttackDetected
        ,captchaTriggered |-> captchaTriggered
        ,activeSessions |-> activeSessions
        ,csrfTokenValid |-> csrfTokenValid
        ,currentUser |-> currentUser
        ,userSessions |-> userSessions
        ,sessionFixationGuarded |-> sessionFixationGuarded
        ,auditLogStream |-> auditLogStream
        ,tokenSessionMap |-> tokenSessionMap
        ,userRoles |-> userRoles
        ,rateLimitStatus |-> rateLimitStatus
        ,retryCount |-> retryCount
        ,userAccountStatus |-> userAccountStatus
        
        \* Put additional constant-, state-, and action-level expressions here:
        \* ,_stateNumber |-> _TEPosition
        \* ,_networkChannelUnchanged |-> networkChannel = networkChannel'
        
        \* Format the `networkChannel` variable as Json value.
        \* ,_networkChannelJson |->
        \*     LET J == INSTANCE Json
        \*     IN J!ToJson(networkChannel)
        
        \* Lastly, you may build expressions over arbitrary sets of states by
        \* leveraging the _TETrace operator.  For example, this is how to
        \* count the number of times a spec variable changed up to the current
        \* state in the trace.
        \* ,_networkChannelModCount |->
        \*     LET F[s \in DOMAIN _TETrace] ==
        \*         IF s = 1 THEN 0
        \*         ELSE IF _TETrace[s].networkChannel # _TETrace[s-1].networkChannel
        \*             THEN 1 + F[s-1] ELSE F[s-1]
        \*     IN F[_TEPosition - 1]
    ]

=============================================================================



Parsing and semantic processing can take forever if the trace below is long.
 In this case, it is advised to uncomment the module below to deserialize the
 trace from a generated binary file.

\*
\*---- MODULE AuthFlow_TETrace ----
\*EXTENDS IOUtils, AuthFlow_TEConstants, AuthFlow, TLC
\*
\*trace == IODeserialize("AuthFlow_TTrace_1785835582.bin", TRUE)
\*
\*=============================================================================
\*

---- MODULE AuthFlow_TETrace ----
EXTENDS AuthFlow_TEConstants, AuthFlow, TLC

trace == 
    <<
    ([backendServiceStatus |-> "healthy",networkChannel |-> "connected",userPermissions |-> (user1 :> {"read"} @@ user2 :> {"read"}),backendDbPool |-> "healthy",captchaTriggered |-> FALSE,lockoutStatus |-> "unlocked",tokenTTLMap |-> (at1 :> 5 @@ at2 :> 5),tokenOwnerMap |-> (at1 :> "none" @@ at2 :> "none" @@ rt1 :> "none" @@ rt2 :> "none"),replayAttackDetected |-> FALSE,authState |-> "idle",currentCredentials |-> "none",retryCount |-> 0,activeAccessToken |-> "none",tokenSessionMap |-> (at1 :> "none" @@ at2 :> "none"),activeRefreshToken |-> "none",sessionFixationGuarded |-> TRUE,revokedTokens |-> {},userRoles |-> (user1 :> "user" @@ user2 :> "user"),rateLimitStatus |-> "allowed",currentUser |-> "none",userSessions |-> (user1 :> {} @@ user2 :> {}),csrfTokenValid |-> TRUE,activeSessions |-> {},userAccountStatus |-> (user1 :> "active" @@ user2 :> "active"),auditLogStream |-> <<>>]),
    ([backendServiceStatus |-> "healthy",networkChannel |-> "connected",userPermissions |-> (user1 :> {"read"} @@ user2 :> {"read"}),backendDbPool |-> "healthy",captchaTriggered |-> FALSE,lockoutStatus |-> "unlocked",tokenTTLMap |-> (at1 :> 5 @@ at2 :> 5),tokenOwnerMap |-> (at1 :> "none" @@ at2 :> "none" @@ rt1 :> "none" @@ rt2 :> "none"),replayAttackDetected |-> FALSE,authState |-> "validating_client",currentCredentials |-> cred1,retryCount |-> 0,activeAccessToken |-> "none",tokenSessionMap |-> (at1 :> "none" @@ at2 :> "none"),activeRefreshToken |-> "none",sessionFixationGuarded |-> TRUE,revokedTokens |-> {},userRoles |-> (user1 :> "user" @@ user2 :> "user"),rateLimitStatus |-> "allowed",currentUser |-> "none",userSessions |-> (user1 :> {} @@ user2 :> {}),csrfTokenValid |-> TRUE,activeSessions |-> {},userAccountStatus |-> (user1 :> "active" @@ user2 :> "active"),auditLogStream |-> <<>>]),
    ([backendServiceStatus |-> "healthy",networkChannel |-> "connected",userPermissions |-> (user1 :> {"read"} @@ user2 :> {"read"}),backendDbPool |-> "healthy",captchaTriggered |-> FALSE,lockoutStatus |-> "unlocked",tokenTTLMap |-> (at1 :> 5 @@ at2 :> 5),tokenOwnerMap |-> (at1 :> "none" @@ at2 :> "none" @@ rt1 :> "none" @@ rt2 :> "none"),replayAttackDetected |-> FALSE,authState |-> "backend_validating",currentCredentials |-> cred1,retryCount |-> 0,activeAccessToken |-> "none",tokenSessionMap |-> (at1 :> "none" @@ at2 :> "none"),activeRefreshToken |-> "none",sessionFixationGuarded |-> TRUE,revokedTokens |-> {},userRoles |-> (user1 :> "user" @@ user2 :> "user"),rateLimitStatus |-> "allowed",currentUser |-> "none",userSessions |-> (user1 :> {} @@ user2 :> {}),csrfTokenValid |-> TRUE,activeSessions |-> {},userAccountStatus |-> (user1 :> "active" @@ user2 :> "active"),auditLogStream |-> <<>>]),
    ([backendServiceStatus |-> "healthy",networkChannel |-> "connected",userPermissions |-> (user1 :> {"read"} @@ user2 :> {"read"}),backendDbPool |-> "healthy",captchaTriggered |-> FALSE,lockoutStatus |-> "unlocked",tokenTTLMap |-> (at1 :> 5 @@ at2 :> 5),tokenOwnerMap |-> (at1 :> user1 @@ at2 :> "none" @@ rt1 :> user1 @@ rt2 :> "none"),replayAttackDetected |-> FALSE,authState |-> "authenticated",currentCredentials |-> cred1,retryCount |-> 0,activeAccessToken |-> at1,tokenSessionMap |-> (at1 :> sess1 @@ at2 :> "none"),activeRefreshToken |-> rt1,sessionFixationGuarded |-> TRUE,revokedTokens |-> {},userRoles |-> (user1 :> "user" @@ user2 :> "user"),rateLimitStatus |-> "allowed",currentUser |-> user1,userSessions |-> (user1 :> {sess1} @@ user2 :> {}),csrfTokenValid |-> TRUE,activeSessions |-> {sess1},userAccountStatus |-> (user1 :> "active" @@ user2 :> "active"),auditLogStream |-> <<[type |-> "LOGIN_SUCCESS", data |-> [user |-> user1, token |-> at1, session |-> sess1], time |-> 1]>>]),
    ([backendServiceStatus |-> "healthy",networkChannel |-> "connected",userPermissions |-> (user1 :> {"read"} @@ user2 :> {"read"}),backendDbPool |-> "healthy",captchaTriggered |-> FALSE,lockoutStatus |-> "unlocked",tokenTTLMap |-> (at1 :> 5 @@ at2 :> 5),tokenOwnerMap |-> (at1 :> user1 @@ at2 :> "none" @@ rt1 :> user1 @@ rt2 :> "none"),replayAttackDetected |-> FALSE,authState |-> "authenticated",currentCredentials |-> cred1,retryCount |-> 0,activeAccessToken |-> at1,tokenSessionMap |-> (at1 :> sess1 @@ at2 :> "none"),activeRefreshToken |-> rt1,sessionFixationGuarded |-> TRUE,revokedTokens |-> {at1, rt1},userRoles |-> (user1 :> "user" @@ user2 :> "user"),rateLimitStatus |-> "allowed",currentUser |-> user1,userSessions |-> (user1 :> {sess1} @@ user2 :> {}),csrfTokenValid |-> TRUE,activeSessions |-> {sess1},userAccountStatus |-> (user1 :> "active" @@ user2 :> "active"),auditLogStream |-> <<[type |-> "LOGIN_SUCCESS", data |-> [user |-> user1, token |-> at1, session |-> sess1], time |-> 1], [type |-> "REFRESH_TOKEN_ROTATED", data |-> [oldToken |-> rt1, newToken |-> rt1], time |-> 2]>>])
    >>
----


=============================================================================

---- MODULE AuthFlow_TEConstants ----
EXTENDS AuthFlow

CONSTANTS user1, user2, cred1, cred2, at1, at2, rt1, rt2, sess1, sess2

=============================================================================

---- CONFIG AuthFlow_TTrace_1785835582 ----
CONSTANTS
    Users = { user1 , user2 }
    Credentials = { cred1 , cred2 }
    AccessTokens = { at1 , at2 }
    RefreshTokens = { rt1 , rt2 }
    Sessions = { sess1 , sess2 }
    Roles = { "admin" , "manager" , "user" }
    Permissions = { "read" , "write" , "delete" }
    MaxRetries = 3
    MaxSessionsPerUser = 2
    TokenTTL = 5
    user2 = user2
    rt1 = rt1
    rt2 = rt2
    at1 = at1
    sess2 = sess2
    cred1 = cred1
    at2 = at2
    sess1 = sess1
    user1 = user1
    cred2 = cred2

INVARIANT
    _inv

CHECK_DEADLOCK
    \* CHECK_DEADLOCK off because of PROPERTY or INVARIANT above.
    FALSE

INIT
    _init

NEXT
    _next

CONSTANT
    _TETrace <- _trace

ALIAS
    _expression
=============================================================================
\* Generated on Tue Aug 04 14:56:23 IST 2026