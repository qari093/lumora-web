import type {
  RealtimeImpactReport
} from "../realtime-impact/types";

export type ReverberationGauge = {
  contentId: string;
  creatorId: string;
  waveformIntensity: number;
  alertLevel: "quiet" | "moving" | "surging" | "mythic";
};

export function createReverberationGauge(
  report: RealtimeImpactReport
): ReverberationGauge {
  const waveformIntensity =
    Math.min(100, Math.round(report.impactQuotient));

  return {
    contentId: report.contentId,
    creatorId: report.creatorId,
    waveformIntensity,
    alertLevel:
      report.impactQuotient >= 250
        ? "mythic"
        : report.impactQuotient >= 100
          ? "surging"
          : report.impactQuotient >= 30
            ? "moving"
            : "quiet"
  };
}
