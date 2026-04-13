export type DeepColorConfig = {
  enabled: boolean;
  bandingReduction: number;
  vibranceBoost: number;
  contrastProtection: boolean;
};

export function buildDeepColorConfig(): DeepColorConfig {
  return {
    enabled: true,
    bandingReduction: 0.72,
    vibranceBoost: 0.18,
    contrastProtection: true
  };
}
