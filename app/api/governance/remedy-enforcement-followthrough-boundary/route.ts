import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/requireAdminSession";
import {
  REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,
  REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT,
  evaluateRemedyEnforcementFollowthrough,
  type RemedyEnforcementFollowthroughInput,
  type RemedyFollowthroughState,
} from "@/src/core/governance/remedyEnforcementFollowthroughBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const bool = (value: unknown): boolean => value === true;

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";

const optionalText = (
  value: unknown,
): string | null =>
  value == null ? null : text(value);

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        boundary: "remedy_enforcement_followthrough_and_effective_relief",
        version: REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const input: RemedyEnforcementFollowthroughInput = {
    originalDecisionReference: text(body.originalDecisionReference),
    appealOrRemedyReference: text(body.appealOrRemedyReference),
    grantedRelief: text(body.grantedRelief),
    authorizedRemedyOwner: text(body.authorizedRemedyOwner),
    humanReviewCompleted: bool(body.humanReviewCompleted),

    remedyState: text(body.remedyState) as RemedyFollowthroughState,
    remedyScope: text(body.remedyScope),
    correctiveAction: text(body.correctiveAction),
    auditReference: text(body.auditReference),
    idempotencyKey: text(body.idempotencyKey),

    duplicateEffectuationAttempt: bool(
      body.duplicateEffectuationAttempt,
    ),
    exceedsGrantedRelief: bool(body.exceedsGrantedRelief),
    grantedReliefLeftUnenforced: bool(
      body.grantedReliefLeftUnenforced,
    ),

    failedEffectuationVisible: bool(
      body.failedEffectuationVisible,
    ),
    partialEffectuationVisible: bool(
      body.partialEffectuationVisible,
    ),
    escalationReference: optionalText(
      body.escalationReference,
    ),

    restorationRequired: bool(body.restorationRequired),
    restorationState: optionalText(body.restorationState),

    affectedSubjectReference: text(
      body.affectedSubjectReference,
    ),

    privacyBoundaryConfirmed: bool(
      body.privacyBoundaryConfirmed,
    ),
    exposesSecuritySensitiveEvidence: bool(
      body.exposesSecuritySensitiveEvidence,
    ),
    createsSecretRightsRestriction: bool(
      body.createsSecretRightsRestriction,
    ),

    wealthSetsAuthority: bool(body.wealthSetsAuthority),
    popularitySetsAuthority: bool(
      body.popularitySetsAuthority,
    ),
    followerCountSetsAuthority: bool(
      body.followerCountSetsAuthority,
    ),
    tokenBalanceSetsAuthority: bool(
      body.tokenBalanceSetsAuthority,
    ),

    createsGovernmentalAuthority: bool(
      body.createsGovernmentalAuthority,
    ),
    claimsLegalCitizenship: bool(
      body.claimsLegalCitizenship,
    ),
    claimsStatehood: bool(body.claimsStatehood),
    claimsIndependentJurisdiction: bool(
      body.claimsIndependentJurisdiction,
    ),

    effectuationSafe: bool(body.effectuationSafe),
  };

  const result =
    evaluateRemedyEnforcementFollowthrough(input);

  return NextResponse.json(
    {
      ok: result.allowed,
      boundary:
        "remedy_enforcement_followthrough_and_effective_relief",
      version:
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_BOUNDARY_VERSION,
      result,
      contract:
        REMEDY_ENFORCEMENT_FOLLOWTHROUGH_CONTRACT,
      authority: {
        source: "authenticated_admin_session",
        callerSuppliedAuthenticationAccepted: false,
        wealthAuthorityAccepted: false,
        popularityAuthorityAccepted: false,
        followerAuthorityAccepted: false,
        tokenAuthorityAccepted: false,
        governmentalAuthorityCreated: false,
        legalCitizenshipCreated: false,
        statehoodCreated: false,
        independentJurisdictionCreated: false,
      },
    },
    {
      status: result.allowed ? 200 : 422,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
