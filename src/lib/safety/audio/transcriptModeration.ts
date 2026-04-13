export type AudioTranscriptInput = {
  assetId: string;
  transcript?: string;
  language?: string;
  durationMs?: number;
  source?: string;
};

export type AudioTranscriptModerationResult = {
  assetId: string;
  passed: boolean;
  riskScore: number;
  flags: string[];
  action: "allow" | "review" | "block";
};

function textRisk(text: string): number {
  const s = String(text || "").toLowerCase();
  let score = 0;

  const risky = [
    "nsfw","porn","nude","explicit","sexual",
    "gore","blood","kill","murder","suicide",
    "hate","racist","terror","bomb","attack"
  ];

  for (const token of risky) {
    if (s.includes(token)) score += 12;
  }

  return Math.min(score, 100);
}

export function moderateAudioTranscript(input: AudioTranscriptInput): AudioTranscriptModerationResult {
  const flags: string[] = [];
  let riskScore = 0;

  const transcript = String(input.transcript || "");

  if (!transcript) {
    flags.push("missing_transcript");
    riskScore += 10;
  }

  if ((input.durationMs || 0) > 30 * 60 * 1000) {
    flags.push("long_audio_asset");
    riskScore += 10;
  }

  const textScore = textRisk(transcript);
  if (textScore > 0) {
    flags.push("risky_audio_transcript");
    riskScore += textScore;
  }

  if (transcript.length > 5000) {
    flags.push("large_transcript_payload");
    riskScore += 5;
  }

  if (riskScore >= 60) {
    return {
      assetId: input.assetId,
      passed: false,
      riskScore: Math.min(riskScore, 100),
      flags,
      action: "block",
    };
  }

  if (riskScore >= 25) {
    return {
      assetId: input.assetId,
      passed: false,
      riskScore: Math.min(riskScore, 100),
      flags,
      action: "review",
    };
  }

  return {
    assetId: input.assetId,
    passed: true,
    riskScore: Math.min(riskScore, 100),
    flags,
    action: "allow",
  };
}

export function moderateAudioTranscriptBatch(inputs: AudioTranscriptInput[]): AudioTranscriptModerationResult[] {
  return (Array.isArray(inputs) ? inputs : []).map(moderateAudioTranscript);
}
