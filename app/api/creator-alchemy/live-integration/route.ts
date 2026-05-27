import { NextResponse } from "next/server";
import {
  calculateLiveResonance,
  createLiveAlchemyRoom,
  decideLiveRitual,
  validateLiveEmotionalSafety
} from "@/src/core/creator-alchemy/live-integration";

export const dynamic = "force-dynamic";

export async function GET() {
  const room = createLiveAlchemyRoom({
    id: "live-alchemy-demo",
    constellation: "Midnight Souls",
    mode: "dream_chamber",
    hostCreatorId: "demo-creator",
    activeViewers: 42
  });

  const resonance = calculateLiveResonance({
    roomId: room.id,
    silentViewers: 30,
    quietGifts: 8,
    lingerSecondsAvg: 90,
    emotionalSafetyScore: 0.96
  });

  const moderationSafe = validateLiveEmotionalSafety({
    moderationEnabled: room.moderationEnabled,
    reportedMessages: 0,
    unsafeSignals: 0,
    hostSanctuaryMode: false
  });

  const ritual = decideLiveRitual({
    ritual: "dream_chamber",
    resonance,
    moderationSafe,
    daysSinceLastRitual: 21
  });

  return NextResponse.json({
    ok: true,
    room,
    resonance,
    ritual
  });
}
