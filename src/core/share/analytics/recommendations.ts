import type { ShareQualityMetrics } from "./types";

export function recommendNextShareAction(metrics: ShareQualityMetrics): string {
  if (metrics.serenityScore < 0.62) return "prefer_silent_share";
  if (metrics.emotionalDepth >= 0.78) return "create_memory_constellation";
  if (metrics.relationshipFit >= 0.82) return "send_echo_share";
  if (metrics.portalFit < 0.55) return "try_lumaspace_destination";
  return "continue_gentle_sharing";
}
