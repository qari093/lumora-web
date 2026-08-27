import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/src/lib/auth/requireAdminSession";
import {
  evaluateConstitutionalRatification,
  type ConstitutionalRatificationInput,
} from "@/src/core/governance/constitutionalRatificationBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
};

type ClientRatificationInput = Omit<
  ConstitutionalRatificationInput,
  "authenticated" | "explicitlyDelegated"
>;

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: ClientRatificationInput;

  try {
    body = (await request.json()) as ClientRatificationInput;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: PRIVATE_HEADERS,
      },
    );
  }

  const result = evaluateConstitutionalRatification({
    ...body,

    // Consequential authority is derived only from the authenticated
    // server-side admin boundary. The caller cannot provide these values.
    authenticated: true,
    explicitlyDelegated: true,
  });

  return NextResponse.json(
    {
      ok: result.allowed,
      result,
    },
    {
      status: result.allowed ? 200 : 422,
      headers: PRIVATE_HEADERS,
    },
  );
}
