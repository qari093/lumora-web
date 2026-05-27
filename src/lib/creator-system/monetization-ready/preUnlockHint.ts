export type PreUnlockHint = {
  visible: boolean;
  message: string;
  pressureFree: true;
};

export function buildSoftPreUnlockHint(input: {
  invisibleValueScore: number;
  threshold: number;
}): PreUnlockHint {
  const near = input.invisibleValueScore >= input.threshold * 0.8;

  return {
    visible: near,
    message: near ? "A deeper creator space may become available soon." : "",
    pressureFree: true,
  };
}
