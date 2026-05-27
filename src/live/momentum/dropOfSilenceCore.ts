export type DropOfSilenceState = {
  active: boolean;
  durationMs: number;
  reason: "countdown" | "winner_reveal" | "ritual_climax";
};

export function createDropOfSilence(reason: DropOfSilenceState["reason"]): DropOfSilenceState {
  return {
    active: true,
    durationMs: 5000,
    reason,
  };
}
