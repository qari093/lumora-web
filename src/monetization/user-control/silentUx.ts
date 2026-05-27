export function buildSilentNotNowUx(input: {
  active: boolean;
}) {
  return {
    visible: false,
    blocksFlow: false,
    hapticHint: input.active ? "soft_pulse" : null,
    monetizationSuppressed: input.active,
  };
}
