import type {
  SafetyDecision
} from "../trust/types";

export function evaluateContentSafety(input: {
  violence: number;
  exploitation: number;
  harassment: number;
}): SafetyDecision {
  const max =
    Math.max(
      input.violence,
      input.exploitation,
      input.harassment
    );

  if (max >= 90) return "block";
  if (max >= 70) return "review";
  if (max >= 40) return "limit";

  return "allow";
}
