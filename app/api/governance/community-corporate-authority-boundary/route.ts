import { NextRequest, NextResponse } from "next/server";

import {
  type CommunityCorporateDecisionClass,
  evaluateCommunityCorporateAuthorityBoundary,
} from "@/src/core/governance/communityCorporateAuthorityBoundary";
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from "@/src/lib/auth/requireAdminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const decisionClasses =
  new Set<CommunityCorporateDecisionClass>([
    "community_policy",
    "community_moderation",
    "community_program",
    "corporate_fiduciary",
    "corporate_statutory",
    "regulatory_compliance",
    "contractual_obligation",
    "platform_treasury",
    "community_budget_advisory",
  ]);

function parseDecisionClass(
  value: unknown,
): CommunityCorporateDecisionClass | undefined {
  return typeof value === "string" &&
    decisionClasses.has(value as CommunityCorporateDecisionClass)
    ? (value as CommunityCorporateDecisionClass)
    : undefined;
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
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_JSON",
      },
      {
        status: 400,
        headers: adminNoStoreHeaders(),
      },
    );
  }

  const role =
    typeof auth.identity.role === "string"
      ? auth.identity.role.toLowerCase()
      : "";

  const canonicalAdminDelegation = role === "admin";

  const decision =
    evaluateCommunityCorporateAuthorityBoundary({
      authenticated: true,
      explicitlyDelegated: canonicalAdminDelegation,

      decisionClass: parseDecisionClass(body.decisionClass),

      communityRoleClaimed:
        body.communityRoleClaimed === true,
      communityApprovalClaimed:
        body.communityApprovalClaimed === true,

      corporateLegalActorAuthorized:
        body.corporateLegalActorAuthorized === true &&
        canonicalAdminDelegation,

      treasuryAuthorityExplicitlyDelegated:
        body.treasuryAuthorityExplicitlyDelegated === true &&
        canonicalAdminDelegation,

      attemptsToOverrideCorporateDuty:
        body.attemptsToOverrideCorporateDuty === true,

      attemptsToCreateStateAuthority:
        body.attemptsToCreateStateAuthority === true,

      attemptsToCreateLegalSovereignty:
        body.attemptsToCreateLegalSovereignty === true,

      attemptsToCreateTokenVotingAuthority:
        body.attemptsToCreateTokenVotingAuthority === true,

      attemptsToCreateUnboundedTreasuryAuthority:
        body.attemptsToCreateUnboundedTreasuryAuthority === true,

      documentedPurpose:
        body.documentedPurpose === true,

      scopeDefined:
        body.scopeDefined === true,

      auditRequired:
        body.auditRequired === true,
    });

  return NextResponse.json(
    {
      ok: decision.allowed,
      boundary: "community_corporate_authority_and_treasury_separation",
      actor: {
        authenticatedUserId: auth.identity.userId,
        authoritySource:
          canonicalAdminDelegation
            ? "authenticated_admin_delegation"
            : "no_consequential_delegation",
      },
      decision,
    },
    {
      status: decision.allowed ? 200 : 403,
      headers: adminNoStoreHeaders(),
    },
  );
}
