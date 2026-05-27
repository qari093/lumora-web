import type { AtmosphereMode } from "../core/types";
import type { SocialPresenceSignal } from "./socialPresence";

export type SynchronicityFlare = {
  flareId: string;
  mode: AtmosphereMode;
  participantCount: number;
  closesAt: number;
  active: boolean;
  label: string;
};

export function detectSynchronicityFlare(input: {
  mode: AtmosphereMode;
  signals: SocialPresenceSignal[];
  now?: number;
  threshold?: number;
  durationMs?: number;
}): SynchronicityFlare | null {
  const now = input.now ?? Date.now();
  const threshold = input.threshold ?? 3;
  const durationMs = input.durationMs ?? 240000;

  const participants = input.signals.filter(
    signal => signal.visible && signal.mode === input.mode
  );

  if (participants.length < threshold) {
    return null;
  }

  return {
    flareId: `flare_${input.mode}_${now}`,
    mode: input.mode,
    participantCount: participants.length,
    closesAt: now + durationMs,
    active: true,
    label: `Your ${input.mode} window closes soon`
  };
}
