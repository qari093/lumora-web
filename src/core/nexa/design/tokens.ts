export const nexaDesignTokens = {
  gridBase: 8,
  mobileColumns: 4,
  tabletColumns: 12,
  mobileMargin: 16,
  tabletMargin: 24,
  gutter: 16,
  typography: {
    caption: 12,
    body: 15,
    subtitle: 18,
    title: 24,
    hero: 32
  },
  colors: {
    surface: "#0A0E14",
    card: "#131A24",
    primaryText: "#F0F3F5",
    secondaryText: "#8899AA",
    teal: "#40E0D0",
    violet: "#8B5CF6",
    amber: "#F6B44B",
    silverBlue: "#A7C7E7"
  },
  motion: {
    transitionMs: 400,
    ecosystemShiftMs: 600,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
  }
} as const;

export function designTokensHealthy(): boolean {
  return (
    nexaDesignTokens.gridBase === 8 &&
    nexaDesignTokens.mobileColumns === 4 &&
    nexaDesignTokens.tabletColumns === 12 &&
    nexaDesignTokens.motion.transitionMs === 400 &&
    nexaDesignTokens.motion.ecosystemShiftMs === 600
  );
}
