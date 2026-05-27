export type AdEngagement = {
  impressionId: string;
  type: "view_2s" | "hold" | "click" | "reward_complete" | "dismiss";
  occurredAt: number;
};

export function scoreAdEngagement(events: AdEngagement[]) {
  return events.reduce((score, event) => {
    if (event.type === "view_2s") return score + 0.1;
    if (event.type === "hold") return score + 0.35;
    if (event.type === "click") return score + 0.75;
    if (event.type === "reward_complete") return score + 1;
    if (event.type === "dismiss") return score - 0.2;
    return score;
  }, 0);
}
