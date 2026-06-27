export type FypInterruption =
  | "rotate_landscape"
  | "incoming_call"
  | "background_app"
  | "long_press"
  | "swipe_during_load"
  | "low_power_mode";

export interface FypInterruptionResult {
  action: string;
  safe: boolean;
}

export function handleFypInterruption(
  interruption: FypInterruption
): FypInterruptionResult {
  if (interruption === "rotate_landscape") {
    return { action: "show_portrait_lock_hint", safe: true };
  }

  if (interruption === "incoming_call") {
    return { action: "pause_and_mute_then_resume", safe: true };
  }

  if (interruption === "background_app") {
    return { action: "pause_audio_and_video", safe: true };
  }

  if (interruption === "long_press") {
    return { action: "prevent_browser_menu_show_deep_dive", safe: true };
  }

  if (interruption === "swipe_during_load") {
    return { action: "cancel_pending_load_start_next", safe: true };
  }

  return { action: "disable_autoplay_require_tap", safe: true };
}
