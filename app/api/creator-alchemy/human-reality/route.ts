import { NextResponse } from "next/server";
import {
  buildHumanRealityReport,
  decideHumanRealityTuning
} from "@/src/core/creator-alchemy/human-reality";

export const dynamic = "force-dynamic";

export async function GET() {
  const observations = Array.from({ length: 25 }, (_, index) => ({
    creatorId: `creator-${index + 1}`,
    daysActive: 9,
    returnedAfterRest: index % 3 === 0,
    whisperOpened: true,
    whisperUseful: index % 5 !== 0,
    quietGiftSentOrReceived: index % 4 !== 0,
    dreamChamberJoined: index % 3 === 0,
    overloadReported: false,
    trustScore: 0.78
  }));

  const report = buildHumanRealityReport(observations);
  const tuning = decideHumanRealityTuning(report);

  return NextResponse.json({ ok: true, report, tuning });
}
