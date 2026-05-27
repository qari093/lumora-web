export const gmarDesignTokens = {
  colors: {
    void: "#0B0B1A",
    nebulaBlue: "#1A2B4C",
    auroraTeal: "#3AE0D9",
    etherealGold: "#D9B065",
    honorViolet: "#7A3B9E",
    memoryWhite: "#E8E8E8",
    calmRose: "#D99494",
  },
  motion: {
    transitionMs: 600,
    particleSpeed: 0.3,
    reducedMotionSafe: true,
  },
  layout: {
    centralCanvas: 60,
    personalHalo: 20,
    socialOrbit: 20,
  },
} as const;

export function gmarDesignTokensHealthy(): boolean {
  const layoutTotal =
    gmarDesignTokens.layout.centralCanvas +
    gmarDesignTokens.layout.personalHalo +
    gmarDesignTokens.layout.socialOrbit;

  return (
    layoutTotal === 100 &&
    gmarDesignTokens.motion.transitionMs <= 600 &&
    gmarDesignTokens.motion.reducedMotionSafe
  );
}
