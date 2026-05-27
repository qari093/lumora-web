export function cinematicRecommendation(mood: string) {
  return {
    mood,
    lane: mood === "calm" ? "slow-cinema" : "featured-cinema"
  };
}
