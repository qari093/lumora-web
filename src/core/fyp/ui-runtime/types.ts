export type FypVisualMode =
  | "calm"
  | "drift"
  | "chaos"
  | "pulse";

export type FypVisualTheme = {
  mode: FypVisualMode;
  aura: string;
  motion: "soft" | "fluid" | "electric" | "surge";
  intensity: number;
};

export type FypGestureIntent =
  | "next"
  | "previous"
  | "open-resonance"
  | "pulse"
  | "save"
  | "share";

export type FypInteractionRailItem = {
  id: string;
  label: string;
  active: boolean;
};
