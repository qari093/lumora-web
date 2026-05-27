import type {
  SocialSignal,
  SocialSignalResult
} from "../types";

export function amplifySocialSignal(
  signal: SocialSignal
): SocialSignalResult {
  const viralScore =
    signal.strength * 10;

  return {
    id: signal.id,
    viralScore,
    amplified: viralScore >= 70
  };
}
