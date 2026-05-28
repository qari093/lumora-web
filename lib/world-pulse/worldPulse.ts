export type WorldPulse = {
  active: boolean;
  tone: "wonder" | "calm" | "cinematic" | "nostalgic";
  label: string;
  generatedBy: "system-atmosphere";
};

export function createWorldPulse(tone: WorldPulse["tone"] = "wonder"): WorldPulse {
  return {
    active: true,
    tone,
    label: "A quiet resonance is moving through Lumora.",
    generatedBy: "system-atmosphere"
  };
}
