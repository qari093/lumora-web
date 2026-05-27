import {
  buildBreathingDashboard,
  type BreathingDashboardModel
} from "@/src/core/creator-alchemy/dashboard";
import { createQuietGift } from "@/src/core/creator-alchemy/economy";
import { buildResonanceLedger } from "@/src/core/creator-alchemy/economy";
import { generateWhispers, type WhisperEvent } from "@/src/core/creator-alchemy/whisper";
import type { CreatorAlchemyEvent } from "./types";
import { aggregateCreatorEvents } from "./aggregate";

export function buildLiveCreatorDashboard(creatorId: string, events: readonly CreatorAlchemyEvent[]): BreathingDashboardModel {
  const aggregate = aggregateCreatorEvents(creatorId, events);

  const giftEvents = aggregate.events
    .filter((event) => event.type === "quiet_gift" && event.giftType)
    .map((event) =>
      createQuietGift({
        id: event.id,
        type: event.giftType!,
        creatorId: event.creatorId,
        viewerId: event.viewerId,
        createdAt: event.createdAt,
        silentCoinsValue: 0
      })
    );

  const ledger = buildResonanceLedger(creatorId, giftEvents);

  const whisperEvents: WhisperEvent[] = [
    {
      signal: "rewatch_peak",
      videoId: aggregate.events[0]?.videoId ?? "unknown",
      timestampSeconds: aggregate.strongestTimestamp,
      strength: aggregate.silentReturnCount >= 2 ? 0.82 : 0.38,
      sampleSize: Math.max(aggregate.silentReturnCount, 3)
    }
  ];

  const whispers = generateWhispers(whisperEvents, false);

  return buildBreathingDashboard({
    stage: "resonance",
    daySignalStrength: aggregate.totalEvents >= 5 ? 0.7 : 0.2,
    recentlyShownAtmospheres: 1,
    seed: {
      state: ledger.state === "quiet_lake" ? "growing" : "blooming",
      label: ledger.state === "quiet_lake" ? "Growing" : "Blooming",
      log: "Your seed strengthened through quiet live resonance."
    },
    whispers: whispers.map((whisper) => ({
      id: whisper.id,
      text: whisper.text,
      videoId: whisper.videoId,
      timestampSeconds: whisper.timestampSeconds,
      priority: whisper.priority
    })),
    orbs: [
      {
        creatorId,
        displayName: "You",
        isSelf: true,
        pulse: aggregate.totalEvents > 0,
        constellation: "Midnight Souls"
      }
    ],
    quietImpact: {
      silentReturnsText: `${aggregate.silentReturnCount} people quietly returned.`,
      quietGiftsText: `${aggregate.quietGiftCount} quiet gifts arrived.`,
      legacyEchoText: "Your work is gathering its first live traces.",
      resonanceState: ledger.state,
      horizonProgress: ledger.horizonProgress
    },
    creativeIntensityEnabled: false
  });
}
