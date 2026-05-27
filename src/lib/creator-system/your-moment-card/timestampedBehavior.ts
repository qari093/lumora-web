import type { HumanTraceMoment } from "./strongestTrace";

export type TimestampedHumanBehavior = {
  videoId: string;
  timestampMs: number;
  behaviorText: string;
  interpretationText: false;
};

export function buildTimestampedHumanBehavior(moment: HumanTraceMoment): TimestampedHumanBehavior {
  const parts = [
    moment.present > 0 ? `${moment.present} present` : "",
    moment.stillness > 0 ? `${moment.stillness} still` : "",
    moment.hold > 0 ? `${moment.hold} held` : "",
    moment.rewatch > 0 ? `${moment.rewatch} returned` : "",
    moment.silentOvation > 0 ? `${moment.silentOvation} silent ovation` : "",
  ].filter(Boolean);

  return {
    videoId: moment.videoId,
    timestampMs: moment.timestampMs,
    behaviorText: parts.join(", ") || "A quiet human trace appeared",
    interpretationText: false,
  };
}
