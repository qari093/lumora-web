import { NextRequest, NextResponse } from "next/server";

import {
  evaluateConflictOfInterestBoundary,
  type GovernanceDecisionClass,
} from "@/src/core/governance/conflictOfInterestBoundary";
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from "@/src/lib/auth/requireAdminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: adminNoStoreHeaders(),
  });
}

function isDecisionClass(
  value: unknown,
): value is GovernanceDecisionClass {
  return (
    value === "advisory" ||
    value === "consequential" ||
    value === "constitutional_amendment"
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return response(
      {
        ok: false,
        error: "INVALID_JSON",
      },
      400,
    );
  }

  const decisionClass = body.decisionClass;

  if (!isDecisionClass(decisionClass)) {
    return response(
      {
        ok: false,
        error: "INVALID_DECISION_CLASS",
      },
      400,
    );
  }

  const affectedUserId =
    typeof body.affectedUserId === "string"
      ? body.affectedUserId.trim()
      : null;

  const decision = evaluateConflictOfInterestBoundary({
    authenticated: true,
    delegatedAuthority: true,
    decisionClass,
    actorUserId: auth.identity.userId,
    affectedUserId,

    declaredConflictOfInterest:
      body.declaredConflictOfInterest === true,
    conflictDisclosed:
      body.conflictDisclosed === true,
    actorRecused:
      body.actorRecused === true,
    independentReviewerAvailable:
      body.independentReviewerAvailable === true,

    actorWouldDirectlyBenefit:
      body.actorWouldDirectlyBenefit === true,
    actorPowerPersonallyAffected:
      body.actorPowerPersonallyAffected === true,
  });

  return response(
    {
      ok: true,
      boundary: {
        ...decision,

        authenticatedAuthoritySource:
          "canonical_admin_session",

        callerSuppliedAuthorityAccepted: false,
        callerSuppliedActorIdentityAccepted: false,

        fundamentalRightsOverrideAllowed: false,
        economicAuthorityEscalationAllowed: false,
        emergencyAuthorityExpansionAllowed: false,
        automatedAuthorityExpansionAllowed: false,

        conflictDisclosureRequired:
          decision.disclosureRequired,

        recusalRequired:
          decision.recusalRequired,

        independentReviewRequired:
          decision.independentReviewRequired,
      },
    },
    200,
  );
}
