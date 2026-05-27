export function unlockPublicCircleAccess(input: {
  userId: string;
  signalCount: number;
}) {
  const unlocked = input.signalCount >= 3;

  return {
    userId: input.userId,
    unlocked,
    reason: unlocked ? "phantom_signal_gate_passed" : "phantom_signal_gate_pending",
  };
}
