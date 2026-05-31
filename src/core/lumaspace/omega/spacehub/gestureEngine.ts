import type { GestureAction, SpaceHubView } from "./types";

export type GestureResult = {
  action: GestureAction;
  nextView: SpaceHubView;
  intent:
    | "preview_living_card"
    | "open_pulse"
    | "return_orbit"
    | "open_discovery"
    | "record_living_card"
    | "send_light";
};

export function resolveGesture(currentView: SpaceHubView, action: GestureAction): GestureResult {
  if (action === "tap_star") {
    return { action, nextView: currentView, intent: "preview_living_card" };
  }

  if (action === "swipe_up") {
    return { action, nextView: "pulse", intent: "open_pulse" };
  }

  if (action === "swipe_down") {
    return { action, nextView: "orbit", intent: "return_orbit" };
  }

  if (action === "pinch_out") {
    return { action, nextView: "orbit", intent: "open_discovery" };
  }

  if (action === "long_press_space") {
    return { action, nextView: "profile", intent: "record_living_card" };
  }

  return { action, nextView: currentView, intent: "send_light" };
}
