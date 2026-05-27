export type SafetyGateResult = {
  gate: "technical" | "copyright" | "visual";
  status: "pass" | "review" | "block";
  reasons: string[];
};

export type SafetyAggregate = {
  contentId: string;
  finalStatus: "safe" | "review" | "blocked";
  gates: SafetyGateResult[];
};

export type FingerprintRecord = {
  perceptualHash: string;
  audioFingerprint: string;
};

export function runTechnicalGate(input: {
  hasAudio: boolean;
  durationSec: number;
  corrupted: boolean;
}) : SafetyGateResult {
  const reasons: string[] = [];

  if (input.corrupted) reasons.push("corrupted_file");
  if (!input.hasAudio) reasons.push("audio_missing");
  if (input.durationSec < 5 || input.durationSec > 90) reasons.push("duration_out_of_bounds");

  return {
    gate: "technical",
    status: reasons.length ? "block" : "pass",
    reasons,
  };
}

export function runCopyrightGate(input: {
  perceptualHash: string;
  audioFingerprint: string;
  knownFingerprints: FingerprintRecord[];
}) : SafetyGateResult {
  const reasons: string[] = [];

  const match = input.knownFingerprints.find(
    (f) =>
      f.perceptualHash === input.perceptualHash ||
      f.audioFingerprint === input.audioFingerprint,
  );

  if (match) reasons.push("copyright_match");

  return {
    gate: "copyright",
    status: reasons.length ? "block" : "pass",
    reasons,
  };
}

export function runVisualSafetyGate(input: {
  nsfwScore: number;
}) : SafetyGateResult {
  if (input.nsfwScore >= 0.9) {
    return { gate: "visual", status: "block", reasons: ["nsfw_high"] };
  }

  if (input.nsfwScore >= 0.5) {
    return { gate: "visual", status: "review", reasons: ["nsfw_medium"] };
  }

  return { gate: "visual", status: "pass", reasons: [] };
}

export function aggregateSafety(input: {
  contentId: string;
  gates: SafetyGateResult[];
}) : SafetyAggregate {
  let finalStatus: SafetyAggregate["finalStatus"] = "safe";

  for (const g of input.gates) {
    if (g.status === "block") {
      finalStatus = "blocked";
      break;
    }
    if (g.status === "review") {
      finalStatus = finalStatus === "blocked" ? "blocked" : "review";
    }
  }

  return {
    contentId: input.contentId,
    finalStatus,
    gates: input.gates,
  };
}

export function applyCreatorTrustBypass(input: {
  aggregate: SafetyAggregate;
  creatorTrustScore: number;
}) : SafetyAggregate {
  if (
    input.aggregate.finalStatus === "review" &&
    input.creatorTrustScore >= 0.8
  ) {
    return {
      ...input.aggregate,
      finalStatus: "safe",
    };
  }

  return input.aggregate;
}

export function createSafetySignal(input: {
  aggregate: SafetyAggregate;
}) {
  if (input.aggregate.finalStatus === "safe") {
    return { eventType: "content.safety.passed" as const };
  }

  if (input.aggregate.finalStatus === "blocked") {
    return { eventType: "content.safety.blocked" as const };
  }

  return { eventType: "content.safety.review" as const };
}
