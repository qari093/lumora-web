export type GmarAntiCheatResult = {
  suspicious: boolean;
  score: number;
  severity: "none" | "low" | "high";
  action: "allow" | "review";
};

export function antiCheat(score: number): GmarAntiCheatResult {
  const value = Number.isFinite(Number(score)) ? Number(score) : 0;
  const suspicious = value >= 90;

  return {
    suspicious,
    score: value,
    severity: suspicious ? "high" : value >= 50 ? "low" : "none",
    action: suspicious ? "review" : "allow"
  };
}
