import { NextRequest, NextResponse } from "next/server";
import { creditWithLedger } from "@/lib/wallet/creditWithLedger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.userId || typeof body?.amount !== "number" || !body?.source) {
      return NextResponse.json(
        { ok: false, error: "missing_credit_ledger_fields" },
        { status: 400 }
      );
    }

    const result = creditWithLedger({
      userId: String(body.userId),
      amount: body.amount,
      source: String(body.source),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_credit_ledger_v1",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "credit_ledger_failed" },
      { status: 500 }
    );
  }
}
