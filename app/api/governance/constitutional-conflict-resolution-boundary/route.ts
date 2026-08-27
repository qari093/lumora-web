import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/requireAdminSession";
import {
  CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,
  CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT,
  evaluateConstitutionalConflictResolution,
  type ConstitutionalConflictResolutionInput,
  type GovernanceRuleSource,
} from "@/src/core/governance/constitutionalConflictResolutionBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function bool(value: unknown): boolean {
  return value === true;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        boundary: "constitutional_conflict_resolution_and_precedence",
        version: CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const input: ConstitutionalConflictResolutionInput = {
    conflictDescription: text(body.conflictDescription),
    leftRuleSource: text(body.leftRuleSource) as GovernanceRuleSource,
    rightRuleSource: text(body.rightRuleSource) as GovernanceRuleSource,
    applicableLawContext: text(body.applicableLawContext),
    ruleScope: text(body.ruleScope),
    rightsImpactReviewCompleted: bool(body.rightsImpactReviewCompleted),

    unresolvedApplicableLawConflict: bool(body.unresolvedApplicableLawConflict),
    reducesFundamentalRights: bool(body.reducesFundamentalRights),
    reducesDueProcess: bool(body.reducesDueProcess),
    reducesPrivacyBaseline: bool(body.reducesPrivacyBaseline),
    reducesHumanReview: bool(body.reducesHumanReview),
    reducesRemedyOrAppeal: bool(body.reducesRemedyOrAppeal),
    reducesAccountability: bool(body.reducesAccountability),

    emergencyClaimsUnboundedPrecedence: bool(body.emergencyClaimsUnboundedPrecedence),
    delegatedAuthorityExceedsParentScope: bool(body.delegatedAuthorityExceedsParentScope),
    economicPowerSetsPrecedence: bool(body.economicPowerSetsPrecedence),
    popularitySetsPrecedence: bool(body.popularitySetsPrecedence),
    wealthSetsPrecedence: bool(body.wealthSetsPrecedence),
    followerCountSetsPrecedence: bool(body.followerCountSetsPrecedence),
    tokenBalanceSetsPrecedence: bool(body.tokenBalanceSetsPrecedence),
    secretPrecedenceRule: bool(body.secretPrecedenceRule),

    createsGovernmentalAuthority: bool(body.createsGovernmentalAuthority),
    claimsIndependentJurisdiction: bool(body.claimsIndependentJurisdiction),
    claimsLegalCitizenship: bool(body.claimsLegalCitizenship),
    claimsStatehood: bool(body.claimsStatehood),
    overridesCorporateLegalEntity: bool(body.overridesCorporateLegalEntity),

    conflictSafelyResolvable: bool(body.conflictSafelyResolvable),
    publicAccountabilityReference:
      body.publicAccountabilityReference == null
        ? null
        : text(body.publicAccountabilityReference),
  };

  const result = evaluateConstitutionalConflictResolution(input);

  return NextResponse.json(
    {
      ok: result.allowed,
      boundary: "constitutional_conflict_resolution_and_precedence",
      version: CONSTITUTIONAL_CONFLICT_RESOLUTION_BOUNDARY_VERSION,
      result,
      contract: CONSTITUTIONAL_CONFLICT_RESOLUTION_CONTRACT,
      authority: {
        source: "authenticated_admin_session",
        callerSuppliedAuthenticationAccepted: false,
        governmentalAuthorityCreated: false,
        legalCitizenshipCreated: false,
        statehoodCreated: false,
        independentJurisdictionCreated: false,
      },
    },
    {
      status: result.allowed ? 200 : 422,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
