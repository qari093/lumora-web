export type AdClickEvent = {
  id: string;
  type: "portal" | "external";
  value: string;
  createdAt: number;
};

export function trackAdClick(input: {
  type: string;
  value: string;
}): AdClickEvent {
  const type = input.type === "external" ? "external" : "portal";

  return {
    id: `clk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    type,
    value: String(input.value || ""),
    createdAt: Date.now(),
  };
}
