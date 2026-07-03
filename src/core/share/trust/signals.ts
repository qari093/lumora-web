import type { SafetySignal, SafetySignalKind } from "./types";

export function createSafetySignal(kind: SafetySignalKind, score: number, reason: string): SafetySignal {
  return {
    id: `safety_${kind}_${Math.round(score * 1000)}`,
    kind,
    score: Number(Math.max(0, Math.min(1, score)).toFixed(4)),
    reason,
  };
}

export function detectUnsafeShareText(text: string): SafetySignal[] {
  const normalized = text.toLowerCase();
  const signals: SafetySignal[] = [];

  if (/(free money|crypto giveaway|urgent transfer|password)/i.test(normalized)) {
    signals.push(createSafetySignal("scam", 0.8, "Potential scam phrase detected."));
  }

  if (/(spam spam|click every link|mass forward)/i.test(normalized)) {
    signals.push(createSafetySignal("spam", 0.6, "Potential spam pattern detected."));
  }

  if (/(malware|trojan|stealer)/i.test(normalized)) {
    signals.push(createSafetySignal("malware_risk", 0.9, "Potential malware language detected."));
  }

  return signals;
}

export function hasBlockingSignal(signals: SafetySignal[]): boolean {
  return signals.some((signal) => signal.score >= 0.85 || signal.kind === "blocked_actor" || signal.kind === "malware_risk");
}
