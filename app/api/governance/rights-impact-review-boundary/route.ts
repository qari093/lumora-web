import { NextResponse } from "next/server";

import { requireAdminSession } from "@/src/lib/auth/requireAdminSession";
import {
  evaluateRightsImpactReview,
  type RightsImpactReviewInput,
} from "@/src/core/governance/rightsImpactReviewBoundary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
} as const;

type RequestBody = Omit<
  RightsImpactReviewInput,
  "authenticated" | "explicitlyDelegated"
>;

export async function POST(request: Request) {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const result = evaluateRightsImpactReview({
    ...body,
    authenticated: true,
    explicitlyDelegated: true,
  });

  return NextResponse.json(
    {
      ok: result.allowed,
      review: result,
    },
    {
      status: result.allowed ? 200 : 422,
      headers: NO_STORE_HEADERS,
    },
  );
}
