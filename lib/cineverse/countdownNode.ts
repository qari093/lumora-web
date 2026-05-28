export type CountdownNode = {
  id: string;
  label: string;
  hoursRemaining: number;
  atmosphereShift: string;
};

export function createCountdownNode(label: string): CountdownNode {
  return {
    id: `countdown-${Date.now()}`,
    label,
    hoursRemaining: 24,
    atmosphereShift: "cinematic-rise"
  };
}
