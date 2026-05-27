export type NotNowGestureInput = {
  gesture: "double_tap" | "three_finger_twist" | "back_tap" | "unknown";
  enabled: boolean;
};

export function detectNotNowGesture(input: NotNowGestureInput) {
  return {
    detected:
      input.enabled &&
      (input.gesture === "double_tap" ||
        input.gesture === "three_finger_twist" ||
        input.gesture === "back_tap"),
    gesture: input.gesture,
  };
}
