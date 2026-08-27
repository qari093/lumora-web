import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/requireAdminSession";
import {
  AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION,
  evaluateAuthorityDelegationLifecycle,
  type AuthorityDelegationLifecycleInput,
} from "@/src/core/governance/authorityDelegationLifecycleBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ClientDelegationLifecycleInput = Omit<
  AuthorityDelegationLifecycleInput,
  "reviewerAuthenticated"
>;

export async function POST(request: Request) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: ClientDelegationLifecycleInput;

  try {
    body = (await request.json()) as ClientDelegationLifecycleInput;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      {
        status: 400,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  const decision = evaluateAuthorityDelegationLifecycle({
    ...body,
    reviewerAuthenticated: true,
  });

  return NextResponse.json(
    {
      ok: true,
      boundary: "governance_authority_delegation_lifecycle_validation",
      boundaryVersion: AUTHORITY_DELEGATION_LIFECYCLE_BOUNDARY_VERSION,
      decision,
      contract: {
        validationOnly: true,
        createsDelegation: false,
        revokesDelegation: false,
        mutatesAuthority: false,
        databaseMutation: false,
      },
    },
    {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}
