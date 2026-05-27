export type MirrorHourState = {
  active: boolean;
  competitivePaused: boolean;
  mood: "mirror_hour";
  message: string;
};

export function createMirrorHourState(active = true): MirrorHourState {
  return {
    active,
    competitivePaused: active,
    mood: "mirror_hour",
    message: active ? "Even silence holds the shape of presence." : "The civilization breathes.",
  };
}

export function mirrorHourHealthy(state = createMirrorHourState()): boolean {
  return state.active && state.competitivePaused && state.mood === "mirror_hour";
}
