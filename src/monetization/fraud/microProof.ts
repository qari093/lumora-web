export function validateMicroInteractionProof(input: {
  holdMs: number;
  requiredMinMs?: number;
  requiredMaxMs?: number;
}) {
  const min = input.requiredMinMs ?? 1200;
  const max = input.requiredMaxMs ?? 2200;

  return {
    ok: input.holdMs >= min && input.holdMs <= max,
    proofType: "time_attention_pulse" as const,
  };
}
