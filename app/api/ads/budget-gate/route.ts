import { NextRequest, NextResponse } from "next/server";
import { evaluateBudgetGate } from "@/lib/ads/budgetGate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.adId ||
      typeof body?.spent !== "number" ||
      typeof body?.budget !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_budget_gate_fields" },
        { status: 400 }
      );
    }

    const result = evaluateBudgetGate({
      adId: String(body.adId),
      spent: body.spent,
      budget: body.budget,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_budget_gate_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "budget_gate_failed" },
      { status: 500 }
    );
  }
}
