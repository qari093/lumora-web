export function validatePhantomUnlockFlow(input: {
  routed: boolean;
  signalCount: number;
  state: string;
}) {
  const shouldUnlock = input.routed && input.signalCount >= 3;
  const ok = shouldUnlock
    ? input.state === "public-circle-unlocked"
    : input.state === "public-circle-pending";

  return {
    ok,
    shouldUnlock,
    reason: ok ? "phantom_unlock_flow_valid" : "phantom_unlock_flow_invalid",
  };
}
