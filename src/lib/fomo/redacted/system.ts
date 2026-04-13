export type RedactedContent = {
  redacted: boolean;
  hint: string;
};

export function buildRedactedContent(): RedactedContent {
  return {
    redacted: true,
    hint: "Visible after countdown or interaction",
  };
}
