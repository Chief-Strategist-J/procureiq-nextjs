--------------------------- MODULE IdentityFlow ---------------------------
EXTENDS Naturals, Sequences, FiniteSets

CONSTANTS
    Organizations,
    Principals,
    Roles,
    Scopes

VARIABLES
    selectedOrg,
    orgAssignments,
    auditChain,
    chainIntegrityStatus,
    uiState

vars == <<selectedOrg, orgAssignments, auditChain, chainIntegrityStatus, uiState>>

Init ==
    /\ selectedOrg \in Organizations
    /\ orgAssignments = [o \in Organizations |-> {}]
    /\ auditChain = [o \in Organizations |-> <<>>]
    /\ chainIntegrityStatus = "unverified"
    /\ uiState = "idle"

SwitchOrganization(newOrg) ==
    /\ newOrg \in Organizations
    /\ selectedOrg' = newOrg
    /\ uiState' = "org_switched"
    /\ UNCHANGED <<orgAssignments, auditChain, chainIntegrityStatus>>

AssignRole(org, principal, role, scope) ==
    /\ org = selectedOrg
    /\ principal \in Principals
    /\ role \in Roles
    /\ scope \in Scopes
    /\ orgAssignments' = [orgAssignments EXCEPT ![org] = orgAssignments[org] \cup {[principal |-> principal, role |-> role, scope |-> scope]}]
    /\ auditChain' = [auditChain EXCEPT ![org] = Append(auditChain[org], [action |-> "ASSIGN_ROLE", principal |-> principal, role |-> role])]
    /\ chainIntegrityStatus' = "unverified"
    /\ uiState' = "role_assigned"
    /\ UNCHANGED <<selectedOrg>>

VerifyAuditChain(org) ==
    /\ org = selectedOrg
    /\ chainIntegrityStatus' = "verified"
    /\ uiState' = "chain_verified"
    /\ UNCHANGED <<selectedOrg, orgAssignments, auditChain>>

Next ==
    \/ \E o \in Organizations : SwitchOrganization(o)
    \/ \E p \in Principals, r \in Roles, s \in Scopes : AssignRole(selectedOrg, p, r, s)
    \/ VerifyAuditChain(selectedOrg)

TypeInvariant ==
    /\ selectedOrg \in Organizations
    /\ chainIntegrityStatus \in {"unverified", "verified", "tampered"}
    /\ uiState \in {"idle", "org_switched", "role_assigned", "chain_verified"}

Spec == Init /\ [][Next]_vars
=============================================================================
