export type LumaMaskMode = "public" | "inner";

export type MaskAtmosphere = {
  mode: LumaMaskMode;
  label: string;
  nebula: "bright" | "deep";
  youGlow: "cyan" | "amber";
  worldOpacity: number;
  transitionMs: number;
};

export const maskAtmospheres: Record<LumaMaskMode, MaskAtmosphere> = {
  public: {
    mode: "public",
    label: "Public Self",
    nebula: "bright",
    youGlow: "cyan",
    worldOpacity: 1,
    transitionMs: 1200
  },
  inner: {
    mode: "inner",
    label: "Inner Self",
    nebula: "deep",
    youGlow: "amber",
    worldOpacity: 0.72,
    transitionMs: 1200
  }
};

export function getMaskAtmosphere(mode: LumaMaskMode): MaskAtmosphere {
  return maskAtmospheres[mode];
}

export function isSanctuarySafeTransition(atmosphere: MaskAtmosphere): boolean {
  return atmosphere.transitionMs === 1200 && atmosphere.worldOpacity >= 0.7;
}
