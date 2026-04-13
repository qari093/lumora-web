export type TrailerTemplate = {
  mode: "hero" | "countdown" | "reaction_buffer";
  headline: string;
  subline: string;
};

export function buildTrailerTemplate(input: {
  title: string;
  countdownLabel?: string;
}): TrailerTemplate[] {
  return [
    {
      mode: "hero",
      headline: input.title,
      subline: "First-class trailer event",
    },
    {
      mode: "countdown",
      headline: "Now Live",
      subline: input.countdownLabel || "Join the drop",
    },
    {
      mode: "reaction_buffer",
      headline: "Crowd arriving",
      subline: "Pre-show hype active",
    },
  ];
}
