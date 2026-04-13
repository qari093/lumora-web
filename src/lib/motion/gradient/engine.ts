export type GradientStop = {
  color: string;
  offset: number;
};

export type MotionGradient = {
  id: string;
  name: string;
  stops: GradientStop[];
  direction: "vertical" | "horizontal" | "radial";
};

export function buildMotionGradient(name = "lumora_prism"): MotionGradient {
  return {
    id: "gradient_" + name,
    name,
    direction: "radial",
    stops: [
      { color: "#0B1020", offset: 0 },
      { color: "#3B1E54", offset: 0.45 },
      { color: "#FF7A18", offset: 1 }
    ]
  };
}
