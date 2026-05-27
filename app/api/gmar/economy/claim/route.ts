import { NextResponse } from "next/server";

import {
  claimGmarZencoinReward,
  assertGmarZencoinClaim
} from "@/src/core/gmar/economy-active/zencoin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state || typeof body.amount !== "number") {
      throw new Error("GMAR state and amount are required.");
    }

    const result = claimGmarZencoinReward({
      state: body.state,
      wallet: body.wallet,
      amount: body.amount,
      reason:
        typeof body.reason === "string"
          ? body.reason
          : "GMAR reward",
      claimKey:
        typeof body.claimKey === "string"
          ? body.claimKey
          : ""
    });

    assertGmarZencoinClaim(result);

    return NextResponse.json({
      ok: true,
      result
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR Zencoin claim failed."
      },
      { status: 400 }
    );
  }
}
