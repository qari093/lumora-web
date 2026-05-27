export type GroundFragment = {
  anchorId: string;
  dominantColor: string;
  texture: "soft" | "sharp" | "grain" | "light" | "shadow";
  luminosity: number;
};

export function normalizeLuminosity(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
