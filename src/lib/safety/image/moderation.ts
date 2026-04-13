export type ImageModerationInput = {
  imageId: string;
  mimeType?: string;
  width?: number;
  height?: number;
  filename?: string;
  altText?: string;
  source?: string;
};

export type ImageModerationResult = {
  imageId: string;
  passed: boolean;
  riskScore: number;
  flags: string[];
  action: "allow" | "review" | "block";
};

function textRisk(text: string): number {
  const s = String(text || "").toLowerCase();
  let score = 0;

  const risky = [
    "nsfw", "porn", "nude", "naked", "explicit", "18+",
    "gore", "blood", "beheading", "violence", "leak"
  ];

  for (const token of risky) {
    if (s.includes(token)) score += 15;
  }

  return Math.min(score, 100);
}

export function moderateImage(input: ImageModerationInput): ImageModerationResult {
  const flags: string[] = [];
  let riskScore = 0;

  const mimeType = String(input.mimeType || "").toLowerCase();
  const filename = String(input.filename || "");
  const altText = String(input.altText || "");
  const source = String(input.source || "");

  if (mimeType && !["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(mimeType)) {
    flags.push("unsupported_image_mime");
    riskScore += 20;
  }

  if ((input.width || 0) > 12000 || (input.height || 0) > 12000) {
    flags.push("suspicious_image_dimensions");
    riskScore += 15;
  }

  const textScore = textRisk([filename, altText, source].join(" "));
  if (textScore > 0) {
    flags.push("risky_image_metadata");
    riskScore += textScore;
  }

  if ((input.width || 0) < 32 || (input.height || 0) < 32) {
    flags.push("tiny_image_artifact");
    riskScore += 10;
  }

  if (riskScore >= 60) {
    return {
      imageId: input.imageId,
      passed: false,
      riskScore: Math.min(riskScore, 100),
      flags,
      action: "block",
    };
  }

  if (riskScore >= 25) {
    return {
      imageId: input.imageId,
      passed: false,
      riskScore: Math.min(riskScore, 100),
      flags,
      action: "review",
    };
  }

  return {
    imageId: input.imageId,
    passed: true,
    riskScore: Math.min(riskScore, 100),
    flags,
    action: "allow",
  };
}

export function moderateImageBatch(inputs: ImageModerationInput[]): ImageModerationResult[] {
  return (Array.isArray(inputs) ? inputs : []).map(moderateImage);
}
