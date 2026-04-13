export type TrailerMaskConfig = {
  enabled: boolean;
  edgeVignette: number;
  audioReactiveCorners: boolean;
  safeTitleZone: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export function buildTrailerMaskConfig(): TrailerMaskConfig {
  return {
    enabled: true,
    edgeVignette: 0.22,
    audioReactiveCorners: true,
    safeTitleZone: {
      top: 48,
      right: 48,
      bottom: 72,
      left: 48,
    },
  };
}
