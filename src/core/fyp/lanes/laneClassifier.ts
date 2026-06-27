import {
  FYP_EMOTIONAL_LANES,
  type FypEmotionalLane
} from "./laneRegistry";

export interface LaneInput {
  title: string;
  description?: string;
}

export function classifyLane(
  input: LaneInput
): FypEmotionalLane {
  const text =
    `${input.title} ${input.description ?? ""}`.toLowerCase();

  if (/space|universe|galaxy|nebula|planet/.test(text)) {
    return "wonder";
  }

  if (/tutorial|learn|education|science/.test(text)) {
    return "learn";
  }

  if (/funny|comedy|laugh|meme/.test(text)) {
    return "laugh";
  }

  if (/build|maker|engineering|project/.test(text)) {
    return "build";
  }

  if (/mindful|reflection|journal|calm/.test(text)) {
    return "reflect";
  }

  if (/community|friend|people|together/.test(text)) {
    return "connect";
  }

  return FYP_EMOTIONAL_LANES[0];
}
