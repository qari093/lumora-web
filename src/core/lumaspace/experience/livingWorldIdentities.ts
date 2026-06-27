export const LivingWorldIdentities = Object.freeze({
  pack: "F2",
  doctrine: "Each World must feel like an environment before it becomes a label.",
  worlds: [
    {
      id: "dream",
      atmosphere: "golden-fireflies",
      motion: "slow-drift",
      symbol: "spark"
    },
    {
      id: "wonder",
      atmosphere: "cyan-crystal-dust",
      motion: "stardust-rotation",
      symbol: "diamond"
    },
    {
      id: "creator",
      atmosphere: "blue-geometric-forge",
      motion: "soft-forge-turn",
      symbol: "hexagon"
    },
    {
      id: "shadow",
      atmosphere: "violet-quiet-nebula",
      motion: "low-star-breath",
      symbol: "half-moon"
    },
    {
      id: "gaming",
      atmosphere: "soft-neon-grid",
      motion: "gentle-grid-pulse",
      symbol: "circle"
    },
    {
      id: "calm",
      atmosphere: "water-lotus-ripple",
      motion: "slow-water-ring",
      symbol: "ripple"
    }
  ],
  rules: {
    labelsHiddenByDefault: true,
    noLegacyLayers: true,
    reducedMotionSafe: true,
    serenityFirst: true
  }
});

export function validateLivingWorldIdentities() {
  return (
    LivingWorldIdentities.pack === "F2" &&
    LivingWorldIdentities.worlds.length === 6 &&
    LivingWorldIdentities.rules.labelsHiddenByDefault === true &&
    LivingWorldIdentities.rules.noLegacyLayers === true &&
    LivingWorldIdentities.rules.reducedMotionSafe === true
  );
}
