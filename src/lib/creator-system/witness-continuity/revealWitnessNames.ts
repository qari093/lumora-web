export type CirclePhase = "before-circle" | "during-circle" | "post-circle";

export type WitnessNameReveal = {
  canReveal: boolean;
  names: string[];
  reason: "post_circle_only" | "circle_not_complete";
};

export function revealWitnessNamesPostCircle(input: {
  phase: CirclePhase;
  witnessNames: string[];
}): WitnessNameReveal {
  if (input.phase !== "post-circle") {
    return {
      canReveal: false,
      names: [],
      reason: "circle_not_complete",
    };
  }

  return {
    canReveal: true,
    names: input.witnessNames.map((name) => name.trim()).filter(Boolean),
    reason: "post_circle_only",
  };
}
