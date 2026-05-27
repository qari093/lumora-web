import type { Fyp94AttributionLink, Fyp94AttributionMessage } from "./types";

export function buildFyp94AttributionMessage(link: Fyp94AttributionLink): Fyp94AttributionMessage {
  return {
    waveId: link.waveId,
    message:
      link.contributionLevel === "high"
        ? `Fueled by strong signals like yours in ${link.category}`
        : `Fueled by signals like yours`,
    display: true,
  };
}

export function removeFyp94AttributionPrecision(message: string): string {
  return message.replace(/\b\d+(\.\d+)?%?\b/g, "").replace(/\s+/g, " ").trim();
}
