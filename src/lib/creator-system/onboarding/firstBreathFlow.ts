export type FirstBreathState =
  | "entry"
  | "name-selection"
  | "circle-preview"
  | "gesture-learning"
  | "phantom-circle";

export function nextFirstBreathState(current: FirstBreathState): FirstBreathState {
  const order: FirstBreathState[] = [
    "entry",
    "name-selection",
    "circle-preview",
    "gesture-learning",
    "phantom-circle",
  ];
  const idx = order.indexOf(current);
  return order[Math.min(idx + 1, order.length - 1)];
}
