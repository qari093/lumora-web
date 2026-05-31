import type { EchoCircle, EchoCircleTheme } from "./types";

export type CircleRitualPlan = {
  circleId: string;
  theme: EchoCircleTheme;
  openingPrompt: string;
  reflectionPrompt: string;
  closingPrompt: string;
  totalMinutes: 10;
};

const PROMPTS: Record<EchoCircleTheme, string> = {
  hope: "What small light are you carrying forward?",
  grief: "What deserves to be held gently today?",
  creative_fire: "What wants to be made through you?",
  starting_over: "What is one beginning you can honor?",
  gratitude: "What quiet gift did life give you recently?",
  belonging: "Where did you feel less alone?",
  focus: "What deserves your clean attention?",
};

export function createCircleRitualPlan(circle: EchoCircle): CircleRitualPlan {
  return {
    circleId: circle.id,
    theme: circle.theme,
    openingPrompt: "Arrive quietly. No performance is needed here.",
    reflectionPrompt: PROMPTS[circle.theme],
    closingPrompt: "Carry one sentence with you, and leave the rest in the circle.",
    totalMinutes: 10,
  };
}
