import {
  FYP_EMOTIONAL_LANES,
  type FypEmotionalLane
} from "./laneRegistry";

export function isValidLane(
  lane: string
): lane is FypEmotionalLane {
  return FYP_EMOTIONAL_LANES.includes(
    lane as FypEmotionalLane
  );
}
