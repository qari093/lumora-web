import type { LaunchReadinessReport } from "./types";

export function summarizeLaunchReadiness(report: LaunchReadinessReport): string {
  if (report.ok) {
    return "Creator Alchemy Ω∞ is ready for internal beta validation.";
  }

  return `Creator Alchemy Ω∞ is blocked by: ${report.failed.map((item) => item.gate).join(", ")}`;
}
