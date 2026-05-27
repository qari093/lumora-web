import { detectStrongestTraceMoment, type HumanTraceMoment } from "./strongestTrace";
import { buildTimestampedHumanBehavior } from "./timestampedBehavior";
import { buildSixSecondReplayWindow } from "./replayWindow";
import { buildPresenceSilhouettes } from "./presenceSilhouettes";

export type YourMomentCard = {
  available: boolean;
  behaviorText?: string;
  videoId?: string;
  timestampMs?: number;
  replay?: ReturnType<typeof buildSixSecondReplayWindow>;
  silhouettes: ReturnType<typeof buildPresenceSilhouettes>;
  interpretationText: false;
};

export function buildYourMomentCard(input: {
  moments: HumanTraceMoment[];
  witnessIds: string[];
  videoDurationMs?: number;
}): YourMomentCard {
  const strongest = detectStrongestTraceMoment(input.moments);

  if (!strongest) {
    return {
      available: false,
      silhouettes: [],
      interpretationText: false,
    };
  }

  const behavior = buildTimestampedHumanBehavior(strongest);

  return {
    available: true,
    behaviorText: behavior.behaviorText,
    videoId: strongest.videoId,
    timestampMs: strongest.timestampMs,
    replay: buildSixSecondReplayWindow({
      videoId: strongest.videoId,
      timestampMs: strongest.timestampMs,
      videoDurationMs: input.videoDurationMs,
    }),
    silhouettes: buildPresenceSilhouettes(input.witnessIds),
    interpretationText: false,
  };
}
