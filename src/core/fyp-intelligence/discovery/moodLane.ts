export function moodLane(mood: string) {
  return {
    mood,
    lane: mood === "calm" ? "slow-discovery" : "open-discovery"
  };
}
