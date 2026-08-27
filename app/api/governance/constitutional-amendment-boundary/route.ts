import { NextRequest, NextResponse } from "next/server";

import {
  computeConstitutionalAmendmentDigest,
  CONSTITUTIONAL_AMENDMENT_BOUNDARY_VERSION,
  evaluateConstitutionalAmendment,
} from "@/src/core/governance/constitutionalAmendmentBoundary";
import { requireAdminSession } from "@/src/lib/auth/requireAdminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    const parsed = await request.json();
    body =
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
  } catch {
    body = {};
  }

  const amendmentInput = {
    authenticated: true,
    delegatedAuthority: true,

    currentVersion: text(body.currentVersion),
    proposedVersion: text(body.proposedVersion),

    documentedReason: text(body.documentedReason),
    effectiveDate: text(body.effectiveDate),

    rightsImpactReviewCompleted:
      body.rightsImpactReviewCompleted === true,
    fundamentalRightsReduced:
      body.fundamentalRightsReduced === true,

    conflictOfInterestPresent:
      body.conflictOfInterestPresent === true,
    conflictDisclosed:
      body.conflictDisclosed === true,
    affectedPowerHolder:
      body.affectedPowerHolder === true,
    actorRecused:
      body.actorRecused === true,
    independentReviewCompleted:
      body.independentReviewCompleted === true,

    publicChangeRecordPrepared:
      body.publicChangeRecordPrepared === true,
    lawfulSafetyDisclosureExceptionDocumented:
      body.lawfulSafetyDisclosureExceptionDocumented === true,

    previousVersionPreserved:
      body.previousVersionPreserved === true,
    appendOnlyHistory:
      body.appendOnlyHistory === true,

    previousVersionReference:
      text(body.previousVersionReference),
    previousVersionDigest:
      text(body.previousVersionDigest),
    sealedVersionDigest:
      text(body.sealedVersionDigest),

    emergencyBypassRequested:
      body.emergencyBypassRequested === true,
  };

  const decision =
    evaluateConstitutionalAmendment(amendmentInput);

  const expectedDigest =
    amendmentInput.previousVersionDigest &&
    amendmentInput.currentVersion &&
    amendmentInput.proposedVersion
      ? computeConstitutionalAmendmentDigest(
          amendmentInput,
        )
      : null;

  return NextResponse.json(
    {
      ok: decision.allowed,
      boundary:
        "constitutional_amendment_versioning_history_integrity",
      version:
        CONSTITUTIONAL_AMENDMENT_BOUNDARY_VERSION,
      decision,
      integrity: {
        expectedSealedVersionDigest:
          decision.expectedSealedVersionDigest ??
          expectedDigest,
        previousVersionReferenceRequired: true,
        appendOnlyHistoryRequired: true,
        silentRewriteAllowed: false,
      },
      authority: {
        source: "canonical_admin_session",
        authenticated: true,
        explicitlyDelegated: true,
        callerSuppliedIdentityAccepted: false,
        callerSuppliedAuthorityAccepted: false,
      },
      protections: {
        fundamentalRightsReductionAllowed: false,
        affectedPowerHolderUnilateralVetoAllowed: false,
        emergencyBypassAllowed: false,
        permanentAuthorityExpansionAllowed: false,
        sovereigntyCreated: false,
        electionSystemCreated: false,
        tokenVotingCreated: false,
        councilCreated: false,
        treasuryAuthorityCreated: false,
      },
    },
    {
      status: decision.allowed ? 200 : 422,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
