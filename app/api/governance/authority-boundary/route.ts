import { NextResponse } from "next/server";

import {
  evaluateGovernanceAuthority,
  GOVERNANCE_ECONOMY_FIREWALL_VERSION,
} from "@/src/core/governance/economyAuthorityFirewall";
import {
  requireUserSession,
  userPrivateNoStoreHeaders,
} from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  const role = auth.identity.role ?? null;

  const decision = evaluateGovernanceAuthority({
    userId: auth.identity.userId,
    role,
    isAdmin: role === "admin",
    delegatedGovernanceAuthority: role === "admin",
  });

  return NextResponse.json(
    {
      ok: true,
      version: GOVERNANCE_ECONOMY_FIREWALL_VERSION,
      governanceAuthority: {
        allowed: decision.allowed,
        basis: decision.basis,
      },
      constitutionalBoundary: {
        economySignalsIgnored: decision.economySignalsIgnored,
        authorityCannotBePurchased: decision.authorityCannotBePurchased,
        popularityCannotCreateAuthority:
          decision.popularityCannotCreateAuthority,
        tokenHoldingsCannotCreateAuthority:
          decision.tokenHoldingsCannotCreateAuthority,
      },
    },
    {
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
