import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/requireAdminSession";
import {
  GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_CONTRACT,
  GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
  evaluateGovernanceControlEffectivenessAssurance,
  type AssuranceInput,
} from "@/src/core/governance/governanceControlEffectivenessAssuranceBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: AssuranceInput;

  try {
    body = (await request.json()) as AssuranceInput;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        boundary:
          "governance_control_effectiveness_oversight_and_implementation_assurance",
        version: GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  }

  const decision =
    evaluateGovernanceControlEffectivenessAssurance(body);

  return NextResponse.json(
    {
      ok: decision.authorized,
      boundary:
        "governance_control_effectiveness_oversight_and_implementation_assurance",
      version: GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_VERSION,
      decision,
      contract:
        GOVERNANCE_CONTROL_EFFECTIVENESS_ASSURANCE_CONTRACT,
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
      status: decision.authorized ? 200 : 422,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
