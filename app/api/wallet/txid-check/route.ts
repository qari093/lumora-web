import { NextRequest, NextResponse } from "next/server";
import { checkTransactionId } from "@/lib/wallet/transactionIdGuard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.transactionId) {
      return NextResponse.json(
        { ok: false, error: "missing_transaction_id" },
        { status: 400 }
      );
    }

    const result = checkTransactionId({
      transactionId: String(body.transactionId),
      existingIds: Array.isArray(body?.existingIds) ? body.existingIds.map(String) : [],
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_txid_guard_v1",
      ...result,
    }, { status: result.valid ? 200 : 409 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "txid_check_failed" },
      { status: 500 }
    );
  }
}
