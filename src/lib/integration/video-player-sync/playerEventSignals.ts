export type PlayerEventType = "play" | "pause" | "seek" | "ended" | "timeupdate";

export function mapPlayerEventToSignal(input: {
  eventType: PlayerEventType;
  currentTimeMs: number;
  videoId: string;
  creatorId: string;
  witnessId: string;
}) {
  if (input.eventType === "play") {
    return {
      type: "present",
      videoId: input.videoId,
      creatorId: input.creatorId,
      witnessId: input.witnessId,
      timestampMs: input.currentTimeMs,
      humanOnly: true,
    };
  }

  if (input.eventType === "seek") {
    return {
      type: "rewatch",
      videoId: input.videoId,
      creatorId: input.creatorId,
      witnessId: input.witnessId,
      timestampMs: input.currentTimeMs,
      humanOnly: true,
    };
  }

  return null;
}
