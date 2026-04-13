import type { RiskModeModerationInput } from "./riskModeModeration";

export async function fetchRiskModeModeration(input: RiskModeModerationInput) {
  try {
    const res = await fetch("/api/moderation/risk-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
