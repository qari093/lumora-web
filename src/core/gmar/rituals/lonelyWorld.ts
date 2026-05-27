export type LonelyWorldMetric =
  | "zero_mirror_hour_attendance"
  | "zero_echo_generation"
  | "empty_social_orbit"
  | "no_returning_players"
  | "silent_constellation";

export function lonelyWorldWhisper(metric: LonelyWorldMetric): string {
  const copy: Record<LonelyWorldMetric, string> = {
    zero_mirror_hour_attendance: "Even silence holds the shape of a presence.",
    zero_echo_generation: "The sky is patient. Memory begins with one light.",
    empty_social_orbit: "A lone orbit is still an orbit.",
    no_returning_players: "The world keeps a warm place for return.",
    silent_constellation: "Dormant stars are not dead. They are waiting.",
  };

  return copy[metric];
}

export function lonelyWorldScriptHealthy(): boolean {
  return [
    lonelyWorldWhisper("zero_mirror_hour_attendance"),
    lonelyWorldWhisper("zero_echo_generation"),
    lonelyWorldWhisper("empty_social_orbit"),
    lonelyWorldWhisper("no_returning_players"),
    lonelyWorldWhisper("silent_constellation"),
  ].every((line) => line.length > 12);
}
