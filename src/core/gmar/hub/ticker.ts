export type HubTickerItem = {
  id: string;
  text: string;
  tone: "warm" | "awe" | "mirror" | "memory";
};

export function civilizationTicker(): HubTickerItem[] {
  return [
    { id: "breath", text: "The civilization breathes.", tone: "warm" },
    { id: "mirror", text: "Mirror Hour approaches.", tone: "mirror" },
    { id: "memory", text: "A new memory forms in the sky.", tone: "memory" },
  ];
}
