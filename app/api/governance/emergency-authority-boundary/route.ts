import { NextRequest, NextResponse } from "next/server";
import { requireUserSession } from "@/src/lib/auth/requireUserSession";
import {
  evaluateEmergencyAuthority,
} from "@/src/core/governance/emergencyAuthorityBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const role = auth.identity.role;
  const body = await req.json().catch(() => ({}));

  const delegated = role === "admin";

  const decision = evaluateEmergencyAuthority({
    authenticated: true,
    explicitlyDelegated: delegated,
    emergencyDeclared: body?.emergencyDeclared === true,
    documentedReason:
      typeof body?.reason === "string" && body.reason.trim().length > 0,
    necessityEstablished: body?.necessityEstablished === true,
    ordinaryProcessInsufficient: body?.ordinaryProcessInsufficient === true,
    narrowScope: body?.narrowScope === true,
    proportionate: body?.proportionate === true,
    temporary: body?.temporary === true,
    expiresAt:
      typeof body?.expiresAt === "string" ? body.expiresAt : null,
    reviewPathAvailable: body?.reviewPathAvailable === true,
    remedyAvailable: body?.remedyAvailable === true,
    auditRequired: body?.auditRequired === true,
    attemptsToSuspendFundamentalRights:
      body?.attemptsToSuspendFundamentalRights === true,
    attemptsIrreversibleGovernanceMutation:
      body?.attemptsIrreversibleGovernanceMutation === true,
    attemptsPermanentAuthorityExpansion:
      body?.attemptsPermanentAuthorityExpansion === true,
  });

  return NextResponse.json(
    {
      ok: true,
      constitutionalBoundary: "emergency_authority",
      authoritySource: delegated
        ? "authenticated_explicit_admin_delegation"
        : "no_delegated_emergency_authority",
      permanentGovernanceAuthorityGranted: false,
      decision,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
