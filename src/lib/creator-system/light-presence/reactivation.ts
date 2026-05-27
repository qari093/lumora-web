export type ReactivationWhisper = {
  visible: boolean;
  message: string;
};

export function buildReactivationWhisper(input: {
  driftExceeded: boolean;
}): ReactivationWhisper {
  if (!input.driftExceeded) {
    return { visible: false, message: "" };
  }

  return {
    visible: true,
    message: "You’ve been quietly present. Return when it feels right.",
  };
}
