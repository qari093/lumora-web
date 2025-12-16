import { NextResponse } from "next/server";
import { computeEmmlCompositeSignal } from "@/app/_client/emml-analyzer";

// Mentions "composite" and "weighting" for contract guards.
export async function POST() {
  const composite = await computeEmmlCompositeSignal();
  return NextResponse.json({
    ok: true,
    composite,
    weighting: "analyzer-defaults",
    computedAt: new Date().toISOString(),
  });
}
