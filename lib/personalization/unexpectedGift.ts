export type UnexpectedGift = {
  id: string;
  message: string;
  lane: string;
  confidence: number;
  pressureFree: true;
};

export function createUnexpectedGift(userSignal: {
  preferredLane?: string;
  replayDepth?: number;
  skippedRecently?: boolean;
}): UnexpectedGift {
  const lane = userSignal.skippedRecently
    ? "Calm Earth"
    : userSignal.preferredLane || "Silent Wonder";

  const replayDepth = Math.max(0, userSignal.replayDepth || 0);

  return {
    id: `gift_${lane.toLowerCase().replace(/\s+/g, "_")}`,
    message: "We thought you might feel this.",
    lane,
    confidence: Math.min(0.95, 0.45 + replayDepth * 0.1),
    pressureFree: true
  };
}
