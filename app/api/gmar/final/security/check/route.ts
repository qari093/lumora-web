import { NextResponse } from "next/server";

import {
  evaluateGmarSecurityRequest,
  assertGmarSecurityDecision
} from "@/src/core/gmar/final-completion/security/antiCheat";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.request) {
      throw new Error("GMAR security request is required.");
    }

    const decision = evaluateGmarSecurityRequest({
      request: body.request,
      previousCooldownKeys: Array.isArray(body.previousCooldownKeys)
        ? body.previousCooldownKeys
        : [],
      maxAmount:
        typeof body.maxAmount === "number"
          ? body.maxAmount
          : undefined
    });

    assertGmarSecurityDecision(decision);

    return NextResponse.json({
      ok: true,
      decision
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR security check failed."
      },
      { status: 403 }
    );
  }
}
