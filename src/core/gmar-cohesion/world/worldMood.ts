export function worldMood(intensity: number) {
  return {
    mode: intensity > 0.7 ? "active" : "calm",
    safe: true
  };
}
