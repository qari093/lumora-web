export const HomecomingSequence = Object.freeze({
  pack: "F4",
  status: "SEALED",
  doctrine: "The user must enter LumaSpace through a ritual, not land on a screen.",
  sequence: [
    "BLACK",
    "BLUE_BLADE",
    "LIVING_SPARK",
    "YOUR_SPACE",
    "YOUR_PEOPLE",
    "YOUR_STORY",
    "UNIVERSE_UNFOLDS"
  ],
  preservesRuntimeAfterReveal: [
    "LumaAtmosphereEngine",
    "EnvironmentalWorldEffects",
    "LivingWorldIdentitiesLayer",
    "PresenceConstellationField",
    "AmbientPresenceEvolutionLayer",
    "InteractionMotionField",
    "LivingUniverseComposer"
  ],
  accessibility: {
    reducedMotionSafe: true,
    noBlockingNavigation: true,
    pointerEventsReleased: true
  }
});

export function validateHomecomingSequence() {
  return (
    HomecomingSequence.pack === "F4" &&
    HomecomingSequence.status === "SEALED" &&
    HomecomingSequence.sequence.length === 7 &&
    HomecomingSequence.sequence[0] === "BLACK" &&
    HomecomingSequence.sequence[1] === "BLUE_BLADE" &&
    HomecomingSequence.sequence[2] === "LIVING_SPARK" &&
    HomecomingSequence.sequence[6] === "UNIVERSE_UNFOLDS" &&
    HomecomingSequence.accessibility.reducedMotionSafe === true
  );
}
