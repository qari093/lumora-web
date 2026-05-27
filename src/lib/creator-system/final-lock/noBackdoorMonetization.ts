export type MonetizationAction =
  | "show-soft-hint"
  | "open-micro-value-window"
  | "force-payment"
  | "hide-core-feature"
  | "fake-scarcity";

export function validateNoBackdoorMonetization(action: MonetizationAction) {
  const blocked = ["force-payment", "hide-core-feature", "fake-scarcity"];

  return {
    ok: !blocked.includes(action),
    reason: blocked.includes(action)
      ? "backdoor_monetization_rejected"
      : "monetization_action_allowed",
  };
}
