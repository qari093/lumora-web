export type Fyp94PulseSyncPreference = {
  enabled: boolean;
  hapticsEnabled: boolean;
};

export const FYP94_DEFAULT_PULSE_SYNC_PREFERENCE: Fyp94PulseSyncPreference = {
  enabled: true,
  hapticsEnabled: false,
};

export function applyFyp94PulseSyncPreference(
  effect: {
    visualPulse: boolean;
    haptic: boolean;
  },
  preference: Fyp94PulseSyncPreference,
): {
  visualPulse: boolean;
  haptic: boolean;
} {
  if (!preference.enabled) {
    return { visualPulse: false, haptic: false };
  }

  return {
    visualPulse: effect.visualPulse,
    haptic: effect.haptic && preference.hapticsEnabled,
  };
}
