export function buildGrowthSuggestion(input: {
  drift: number;
  presenceDepth: number;
  resonance: number;
}) {
  if (input.drift > 0.5) {
    return "Shorten opening and improve first 2 seconds";
  }

  if (input.presenceDepth < 0.4) {
    return "Add stronger emotional anchor";
  }

  if (input.resonance < 0.2) {
    return "Create a more memorable ending";
  }

  return "Keep current creative direction";
}
