export const LivingUniverseCore = Object.freeze({
  doctrine: "YOU is the emotional center. Worlds are environments, not labels.",
  hierarchy: ["ATMOSPHERE", "YOU", "ORBIT", "WORLDS", "PRESENCE", "GARDEN"],
  center: {
    id: "YOU",
    role: "living-star",
    breathSeconds: 6,
    dominant: true
  },
  orbit: {
    worlds: ["dream", "wonder", "creator", "shadow", "gaming", "calm"],
    mode: "radial-sanctuary",
    labelPolicy: "reveal-on-focus"
  },
  text: {
    visibleByDefault: false,
    revealOnTouch: true,
    maximumPersistentLabels: 2
  }
});

export function validateLivingUniverseCore() {
  return (
    LivingUniverseCore.center.dominant === true &&
    LivingUniverseCore.center.breathSeconds === 6 &&
    LivingUniverseCore.orbit.worlds.length === 6 &&
    LivingUniverseCore.text.maximumPersistentLabels <= 2
  );
}
