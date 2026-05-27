export function decideAbuseAction(score: number): "allow" | "shadow_review" | "temporary_lock" {
  if (score >= 80) return "temporary_lock";
  if (score >= 40) return "shadow_review";
  return "allow";
}
