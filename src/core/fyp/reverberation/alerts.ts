import type {
  ReverberationGauge
} from "./gauge";

export type ImpactAlert = {
  creatorId: string;
  contentId: string;
  message: string;
  urgent: boolean;
};

export function createImpactAlert(
  gauge: ReverberationGauge
): ImpactAlert {
  return {
    creatorId: gauge.creatorId,
    contentId: gauge.contentId,
    message:
      gauge.alertLevel === "mythic"
        ? "Your signal is becoming myth."
        : gauge.alertLevel === "surging"
          ? "Your signal is surging."
          : "Your signal is moving.",
    urgent:
      gauge.alertLevel === "mythic" ||
      gauge.alertLevel === "surging"
  };
}
