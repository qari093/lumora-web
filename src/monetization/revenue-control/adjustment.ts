export function computeRevenueAdjustment(input: {
  gap: number;
  userState: "green" | "yellow" | "red";
}) {
  if (input.userState === "red") {
    return { action: "none", intensity: 0 };
  }

  if (input.gap > 0.02) {
    return { action: "increase_ads", intensity: 0.2 };
  }

  if (input.gap < -0.02) {
    return { action: "decrease_ads", intensity: 0.2 };
  }

  return { action: "stable", intensity: 0 };
}
