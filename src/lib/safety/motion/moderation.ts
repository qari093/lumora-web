export type MotionFrameInput = {
  assetId: string;
  frameCount?: number;
  fps?: number;
  durationMs?: number;
  title?: string;
  summary?: string;
  tags?: string[];
  source?: string;
};

export type MotionFrameModerationResult = {
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
    "nsfw", "porn", "nude", "naked", "explicit",
    "gore", "blood", "beheading", "violence",
    "self harm", "suicide", "kill", "execution"
  ];

  for (const token of risky) {
    if (s.includes(token)) score += 15;
  }

  return Math.min(score, 100);
}

export function moderateMotionFrame(input: MotionFrameInput): MotionFrameModerationResult {
  const flags: string[] = [];
  let riskScore = 0;

  const frameCount = Number(input.frameCount || 0);
  const fps = Number(input.fps || 0);
  const durationMs = Number(input.durationMs || 0);

  if (frameCount <= 0) {
    flags.push("missing_frame_count");
    riskScore += 10;
  }

  if (fps > 240) {
    flags.push("suspicious_fps");
    riskScore += 10;
  }

  if (durationMs > 10 * 60 * 1000) {
    flags.push("oversized_motion_duration");
    riskScore += 10;
  }

  if (durationMs > 0 && frameCount > 0 && fps > 0) {
    const expectedFrames = (durationMs / 1000) * fps;
    if (frameCount > expectedFrames * 2.5) {
      flags.push("frame_density_anomaly");
      riskScore += 15;
    }
  }

  const textScore = textRisk([
    input.title || "",
    input.summary || "",
    ...(input.tags || []),
    input.source || "",
  ].join(" "));

  if (textScore > 0) {
    flags.push("risky_motion_metadata");
    riskScore += textScore;
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

export function moderateMotionFrameBatch(inputs: MotionFrameInput[]): MotionFrameModerationResult[] {
  return (Array.isArray(inputs) ? inputs : []).map(moderateMotionFrame);
}
