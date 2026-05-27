import type { BrandCompatibilityInput, BrandCompatibilityResult, ConstellationPatronage, RevenueRisk } from "./types";

const BLOCKED_COPY = [
  "buy reach",
  "guaranteed profit",
  "jackpot",
  "bet",
  "casino",
  "viral guaranteed",
  "pay to win"
];

export function evaluateBrandCompatibility(input: BrandCompatibilityInput): BrandCompatibilityResult {
  const risks: RevenueRisk[] = [];
  const copy = input.copy.toLowerCase();

  if (BLOCKED_COPY.some((term) => copy.includes(term))) risks.push("casino_language");
  if (copy.includes("dominate") || copy.includes("crush")) risks.push("poor_fit");
  if (copy.includes("interruption") || copy.includes("banner takeover")) risks.push("loud_ad");

  const toneScore = input.constellationAtmosphere.toLowerCase().includes(input.sponsorTone) ? 0.45 : 0.25;
  const copyScore = risks.length === 0 ? 0.45 : 0.05;
  const restraintScore = copy.length <= 120 ? 0.1 : 0;

  const score = Math.min(1, toneScore + copyScore + restraintScore);

  return {
    ok: risks.length === 0 && score >= 0.7,
    score,
    risks
  };
}

export function createConstellationPatronage(input: {
  id: string;
  brandName: string;
  constellationId: string;
  tone: "calm" | "reflective" | "creative" | "restorative";
  line: string;
  approved: boolean;
}): ConstellationPatronage {
  return {
    id: input.id,
    brandName: input.brandName,
    constellationId: input.constellationId,
    tone: input.tone,
    line: input.line,
    status: input.approved ? "approved" : "draft",
    logoScale: "tiny",
    interruptive: false
  };
}
