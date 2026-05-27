import type { ModerationResult, ModerationReason } from "./types";

const RULES: Array<{ reason: ModerationReason; patterns: RegExp[]; severity: ModerationResult["severity"] }> = [
  { reason: "diagnostic_language", severity: "block", patterns: [/you are depressed/i, /diagnosis/i, /trauma decoded/i] },
  { reason: "guilt_pressure", severity: "review", patterns: [/your audience needs you/i, /come back or/i, /don't leave us/i] },
  { reason: "casino_language", severity: "block", patterns: [/jackpot/i, /bet/i, /casino/i, /guaranteed profit/i, /creator stock/i] },
  { reason: "harassment", severity: "block", patterns: [/worthless/i, /shut up/i] },
  { reason: "self_harm_risk", severity: "review", patterns: [/hurt myself/i, /end it all/i] },
  { reason: "emotional_manipulation", severity: "review", patterns: [/prove you care/i, /if you loved/i] }
];

const ORDER = { safe: 0, watch: 1, review: 2, block: 3 } as const;

export function moderateCreatorAlchemyContent(content: string): ModerationResult {
  const reasons: ModerationReason[] = [];
  let severity: ModerationResult["severity"] = "safe";

  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(content))) {
      reasons.push(rule.reason);
      if (ORDER[rule.severity] > ORDER[severity]) severity = rule.severity;
    }
  }

  return {
    severity,
    reasons: reasons.length ? reasons : ["safe"],
    allow: severity !== "block"
  };
}
