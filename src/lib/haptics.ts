// 🔊 Lumora Haptic Harmonics Core
// Provides simple vibration / haptic feedback patterns for setup & gestures

export type HapticPattern = "pulse" | "wave" | "bloom";

/** Returns true if vibration API is supported */
export function canHaptic(): boolean {
  if (typeof navigator === "undefined") return false;
  return "vibrate" in navigator || !!(window as any).webkit?.messageHandlers?.vibrate;
}

/** Play one of Lumora's harmonic haptic patterns */
export function playHaptic(pattern: HapticPattern): void {
  if (!canHaptic()) return;
  try {
    switch (pattern) {
      case "pulse":
        // quick double tap for Tier 1 or confirm
        navigator.vibrate?.([40, 60, 40]);
        break;
      case "wave":
        // slow rhythmic pattern for flow / learning
        navigator.vibrate?.([20, 40, 60, 40, 20]);
        break;
      case "bloom":
        // gentle expanding feel for re-engagement or success
        navigator.vibrate?.([10, 20, 40, 60, 80, 60, 40, 20]);
        break;
      default:
        navigator.vibrate?.(20);
    }
  } catch (e) {
    console.warn("Haptic error:", e);
  }
}

/** Convenience wrappers */
export const Haptics = {
  pulse: () => playHaptic("pulse"),
  wave: () => playHaptic("wave"),
  bloom: () => playHaptic("bloom"),
};

export default Haptics;
