import { NextResponse } from "next/server";
import {
  GOVERNANCE_DECISION_PUBLICATION_VERSION,
  evaluateGovernanceDecisionPublication,
} from "@/src/core/governance/governanceDecisionPublication";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_BASELINE_DECISIONS = [
  {
    decisionId: "constitutional-baseline",
    decisionType: "constitutional_publication",
    decisionSummary:
      "Public platform governance constitution baseline established.",
    decisionReason:
      "Provide a transparent constitutional reference for platform governance.",
    decisionDate: "2026-08-19",
    effectiveDate: "2026-08-19",
    authorityBasis:
      "documented platform governance framework and constitutional baseline",
    reviewPath:
      "constitutional amendment and ratification review boundary",
    remedyPath:
      "due-process appeal and remedy paths remain available for consequential decisions",
    rightsImpactStatus:
      "rights safeguards preserved and review required for consequential changes",
    conflictReviewStatus:
      "conflict-of-interest safeguards apply to consequential governance authority",
    publicAccountabilityRecord:
      "/api/governance/constitution-publication",
  },
] as const;

export async function GET() {
  const records = PUBLIC_BASELINE_DECISIONS.map((record) => ({
    ...record,
    evaluation: evaluateGovernanceDecisionPublication(record),
  }));

  return NextResponse.json(
    {
      ok: true,
      boundaryVersion: GOVERNANCE_DECISION_PUBLICATION_VERSION,
      publicationMode: "public_read_only",
      durableDatabaseArchiveClaimed: false,
      consequentialDecisionPublicationRequired: true,
      secretInternalMetadataPublicationAllowed: false,
      records,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
