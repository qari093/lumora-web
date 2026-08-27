export const AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION = "mega42-v1" as const;

export type DelegationLifecycleReason =
  | "active_delegation"
  | "reviewer_authentication_required"
  | "delegation_id_required"
  | "delegator_required"
  | "delegate_required"
  | "purpose_required"
  | "scope_required"
  | "audit_reference_required"
  | "public_accountability_reference_required"
  | "invalid_issued_at"
  | "invalid_starts_at"
  | "invalid_expires_at"
  | "start_precedes_issue"
  | "expiry_not_after_start"
  | "decision_time_invalid"
  | "delegation_not_started"
  | "delegation_expired"
  | "delegation_revoked"
  | "revocation_reason_required"
  | "unbounded_scope_forbidden"
  | "automatic_renewal_forbidden"
  | "permanent_delegation_forbidden"
  | "economic_influence_forbidden"
  | "popularity_influence_forbidden"
  | "follower_influence_forbidden"
  | "token_influence_forbidden"
  | "emergency_bypass_forbidden";

export interface AuthorityDelegationLifecycleInput {
  reviewerAuthenticated: boolean;
  delegationId: string;
  delegatedBy: string;
  delegatedTo: string;
  purpose: string;
  scope: readonly string[];
  issuedAt: string | Date;
  startsAt: string | Date;
  expiresAt: string | Date;
  decisionAt?: string | Date;
  revokedAt?: string | Date | null;
  revocationReason?: string | null;
  auditReference: string;
  publicAccountabilityReference: string;
  unboundedScope?: boolean;
  automaticRenewal?: boolean;
  permanentDelegation?: boolean;
  authorityDerivedFromEconomicPower?: boolean;
  authorityDerivedFromPopularity?: boolean;
  authorityDerivedFromFollowerCount?: boolean;
  authorityDerivedFromTokenBalance?: boolean;
  emergencyBypassRequested?: boolean;
}

export interface AuthorityDelegationLifecycleDecision {
  allowed: boolean;
  active: boolean;
  reason: DelegationLifecycleReason;
  boundaryVersion: typeof AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION;
  delegationId: string;
  delegatedBy: string;
  delegatedTo: string;
  purpose: string;
  scope: readonly string[];
  issuedAt: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  evaluatedAt: string | null;
  revokedAt: string | null;
  explicitScopeRequired: true;
  finiteDurationRequired: true;
  revocationSupported: true;
  auditabilityRequired: true;
  publicAccountabilityReferenceRequired: true;
  automaticRenewalAllowed: false;
  permanentDelegationAllowed: false;
  unboundedDelegationAllowed: false;
  authorityCannotBePurchased: true;
  authorityCannotBeDerivedFromPopularity: true;
  authorityCannotBeDerivedFromFollowerCount: true;
  authorityCannotBeDerivedFromTokenBalance: true;
  emergencyBypassAllowed: false;
  lifecycleValidationOnly: true;
  createsDelegation: false;
  revokesDelegation: false;
  mutatesAuthority: false;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function normalizedScope(scope: readonly string[] | undefined): readonly string[] {
  if (!Array.isArray(scope)) return Object.freeze([]);

  return Object.freeze(
    Array.from(
      new Set(
        scope
          .map((entry) => clean(entry))
          .filter((entry) => entry.length > 0),
      ),
    ),
  );
}

function result(
  input: AuthorityDelegationLifecycleInput,
  reason: DelegationLifecycleReason,
  dates: {
    issuedAt?: Date | null;
    startsAt?: Date | null;
    expiresAt?: Date | null;
    decisionAt?: Date | null;
    revokedAt?: Date | null;
  } = {},
): AuthorityDelegationLifecycleDecision {
  const allowed = reason === "active_delegation";

  return {
    allowed,
    active: allowed,
    reason,
    boundaryVersion: AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION,
    delegationId: clean(input.delegationId),
    delegatedBy: clean(input.delegatedBy),
    delegatedTo: clean(input.delegatedTo),
    purpose: clean(input.purpose),
    scope: normalizedScope(input.scope),
    issuedAt: iso(dates.issuedAt ?? null),
    startsAt: iso(dates.startsAt ?? null),
    expiresAt: iso(dates.expiresAt ?? null),
    evaluatedAt: iso(dates.decisionAt ?? null),
    revokedAt: iso(dates.revokedAt ?? null),
    explicitScopeRequired: true,
    finiteDurationRequired: true,
    revocationSupported: true,
    auditabilityRequired: true,
    publicAccountabilityReferenceRequired: true,
    automaticRenewalAllowed: false,
    permanentDelegationAllowed: false,
    unboundedDelegationAllowed: false,
    authorityCannotBePurchased: true,
    authorityCannotBeDerivedFromPopularity: true,
    authorityCannotBeDerivedFromFollowerCount: true,
    authorityCannotBeDerivedFromTokenBalance: true,
    emergencyBypassAllowed: false,
    lifecycleValidationOnly: true,
    createsDelegation: false,
    revokesDelegation: false,
    mutatesAuthority: false,
  };
}

export function evaluateAuthorityDelegationLifecycle(
  input: AuthorityDelegationLifecycleInput,
): AuthorityDelegationLifecycleDecision {
  if (input.reviewerAuthenticated !== true) {
    return result(input, "reviewer_authentication_required");
  }

  if (!clean(input.delegationId)) return result(input, "delegation_id_required");
  if (!clean(input.delegatedBy)) return result(input, "delegator_required");
  if (!clean(input.delegatedTo)) return result(input, "delegate_required");
  if (!clean(input.purpose)) return result(input, "purpose_required");

  if (normalizedScope(input.scope).length === 0) {
    return result(input, "scope_required");
  }

  if (!clean(input.auditReference)) {
    return result(input, "audit_reference_required");
  }

  if (!clean(input.publicAccountabilityReference)) {
    return result(input, "public_accountability_reference_required");
  }

  if (input.unboundedScope === true) {
    return result(input, "unbounded_scope_forbidden");
  }

  if (input.automaticRenewal === true) {
    return result(input, "automatic_renewal_forbidden");
  }

  if (input.permanentDelegation === true) {
    return result(input, "permanent_delegation_forbidden");
  }

  if (input.authorityDerivedFromEconomicPower === true) {
    return result(input, "economic_influence_forbidden");
  }

  if (input.authorityDerivedFromPopularity === true) {
    return result(input, "popularity_influence_forbidden");
  }

  if (input.authorityDerivedFromFollowerCount === true) {
    return result(input, "follower_influence_forbidden");
  }

  if (input.authorityDerivedFromTokenBalance === true) {
    return result(input, "token_influence_forbidden");
  }

  if (input.emergencyBypassRequested === true) {
    return result(input, "emergency_bypass_forbidden");
  }

  const issuedAt = parseDate(input.issuedAt);
  if (!issuedAt) return result(input, "invalid_issued_at");

  const startsAt = parseDate(input.startsAt);
  if (!startsAt) return result(input, "invalid_starts_at", { issuedAt });

  const expiresAt = parseDate(input.expiresAt);
  if (!expiresAt) {
    return result(input, "invalid_expires_at", { issuedAt, startsAt });
  }

  const decisionAt =
    input.decisionAt === undefined ? new Date() : parseDate(input.decisionAt);

  if (!decisionAt) {
    return result(input, "decision_time_invalid", {
      issuedAt,
      startsAt,
      expiresAt,
    });
  }

  if (startsAt.getTime() < issuedAt.getTime()) {
    return result(input, "start_precedes_issue", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
    });
  }

  if (expiresAt.getTime() <= startsAt.getTime()) {
    return result(input, "expiry_not_after_start", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
    });
  }

  const revokedAt =
    input.revokedAt === null || input.revokedAt === undefined
      ? null
      : parseDate(input.revokedAt);

  if (
    input.revokedAt !== null &&
    input.revokedAt !== undefined &&
    revokedAt === null
  ) {
    return result(input, "delegation_revoked", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
    });
  }

  if (revokedAt && !clean(input.revocationReason)) {
    return result(input, "revocation_reason_required", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
      revokedAt,
    });
  }

  if (revokedAt && revokedAt.getTime() <= decisionAt.getTime()) {
    return result(input, "delegation_revoked", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
      revokedAt,
    });
  }

  if (decisionAt.getTime() < startsAt.getTime()) {
    return result(input, "delegation_not_started", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
      revokedAt,
    });
  }

  if (decisionAt.getTime() >= expiresAt.getTime()) {
    return result(input, "delegation_expired", {
      issuedAt,
      startsAt,
      expiresAt,
      decisionAt,
      revokedAt,
    });
  }

  return result(input, "active_delegation", {
    issuedAt,
    startsAt,
    expiresAt,
    decisionAt,
    revokedAt,
  });
}
