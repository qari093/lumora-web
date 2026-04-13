import { NextRequest, NextResponse } from "next/server";
import { createWalletCredit } from "@/lib/surge/walletCredit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.userId || typeof body?.amount !== "number" || !body?.source) {
      return NextResponse.json(
        { ok: false, error: "missing_wallet_credit_fields" },
        { status: 400 }
      );
    }

    const credit = createWalletCredit({
      userId: String(body.userId),
      amount: body.amount,
      source: String(body.source),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_wallet_credit_v1",
      credit,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "wallet_credit_failed" },
      { status: 500 }
    );
  }
}
