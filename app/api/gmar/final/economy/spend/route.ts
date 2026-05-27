import { NextResponse } from "next/server";

import {
  spendGmarZencoin,
  assertGmarEconomyTransaction
} from "@/src/core/gmar/final-completion/economy/economyHardening";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.wallet || typeof body.amount !== "number") {
      throw new Error("GMAR wallet and amount are required.");
    }

    const result = spendGmarZencoin({
      wallet: body.wallet,
      amount: body.amount,
      reason:
        typeof body.reason === "string"
          ? body.reason
          : "GMAR spend",
      transactionId:
        typeof body.transactionId === "string"
          ? body.transactionId
          : "",
      existingTransactionIds: Array.isArray(body.existingTransactionIds)
        ? body.existingTransactionIds
        : []
    });

    assertGmarEconomyTransaction(result);

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
            : "GMAR economy spend failed."
      },
      { status: 400 }
    );
  }
}
