import { NextResponse } from "next/server";
import { buildDreamChamberRuntime } from "@/src/core/creator-alchemy/constellation-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const dreamChamber = buildDreamChamberRuntime({
    constellation: "Midnight Souls",
    resonance: 0.8,
    daysUntilEvent: 2,
    activeNow: false
  });

  return NextResponse.json({ ok: true, dreamChamber });
}
