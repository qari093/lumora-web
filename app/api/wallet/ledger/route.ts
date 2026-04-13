import { NextRequest, NextResponse } from "next/server";
import { createLedgerTransaction } from "@/lib/wallet/ledger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.userId || typeof body?.amount !== "number" || !body?.reference) {
      return NextResponse.json(
        { ok: false, error: "missing_ledger_fields" },
        { status: 400 }
      );
    }

    const transaction = createLedgerTransaction({
      userId: String(body.userId),
      amount: body.amount,
      reference: String(body.reference),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ledger_v1",
      transaction,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ledger_transaction_failed" },
      { status: 500 }
    );
  }
}
