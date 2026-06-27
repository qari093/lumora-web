export const FinalComposition = Object.freeze({
  doctrine: "Living universe before interface.",
  hierarchy: [
    "Homecoming",
    "Atmosphere",
    "YOU",
    "Living Worlds",
    "Friend Presence",
    "Mood Garden",
    "Sovereign Pill"
  ],
  textRule: {
    persistentMaximum: 3,
    worldsRevealOnFocus: true,
    atmosphereFirst: true
  },
  serenityRule: {
    serenity: 70,
    wonder: 20,
    spectacle: 10
  }
});

export function validateFinalComposition() {
  return (
    FinalComposition.hierarchy[0] === "Homecoming" &&
    FinalComposition.hierarchy[2] === "YOU" &&
    FinalComposition.textRule.persistentMaximum <= 3 &&
    FinalComposition.serenityRule.serenity === 70
  );
}
