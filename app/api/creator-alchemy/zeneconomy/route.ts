import { NextResponse } from "next/server";
import {
  appendZenEconomyEntry,
  buildCreatorEconomyRuntime
} from "@/src/core/creator-alchemy/zeneconomy";

export const dynamic = "force-dynamic";

export async function GET() {
  appendZenEconomyEntry({
    id: "demo-zen-entry",
    creatorId: "demo-creator",
    asset: "quiet_coin",
    amount: 1000,
    reason: "demo_quiet_gift_balance",
    createdAt: new Date().toISOString()
  });

  const runtime = buildCreatorEconomyRuntime({
    creatorId: "demo-creator",
    fraudCleared: true,
    creatorVerified: true,
    commerceSafetyPassed: true
  });

  return NextResponse.json({ ok: true, runtime });
}
