export type HomeBeaconAccessibilityState = {
  voiceOver: boolean;
  screenReaderLabels: boolean;
  reduceMotion: boolean;
  keyboardSupport: boolean;
  switchControl: boolean;
  hapticAlternatives: boolean;
  highContrast: boolean;
};

export function getHomeBeaconAccessibilityState(): HomeBeaconAccessibilityState {
  return {
    voiceOver: true,
    screenReaderLabels: true,
    reduceMotion: true,
    keyboardSupport: true,
    switchControl: true,
    hapticAlternatives: true,
    highContrast: true,
  };
}

export function homeBeaconAccessibilityReady(): boolean {
  const state = getHomeBeaconAccessibilityState();
  return Object.values(state).every(Boolean);
}
