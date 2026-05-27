export type Fyp94CrowdSignal = {
  clipId: string;
  category: string;
  viewerCount: number;
  activeWindowId: string;
  capturedAt: string;
};

export type Fyp94CategoryHeat = {
  category: string;
  totalViewers: number;
  heatLevel: "low" | "medium" | "high";
};
