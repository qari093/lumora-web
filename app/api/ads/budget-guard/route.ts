import { NextRequest, NextResponse } from "next/server";
import { checkBudgetGuard } from "@/lib/ads/budgetGuard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.spent !== "number" ||
      typeof body?.budget !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_budget_guard_fields" },
        { status: 400 }
      );
    }

    const result = checkBudgetGuard({
      spent: body.spent,
      budget: body.budget,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_budget_guard_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "budget_guard_failed" },
      { status: 500 }
    );
  }
}
