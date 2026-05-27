import type {
  LegendaryCreator
} from "./types";

export function createLegendaryCreator(input: {
  creatorId: string;
  auraTier: LegendaryCreator["auraTier"];
  impactQuotient: number;
}): LegendaryCreator {
  const eligible =
    (
      input.auraTier === "nova" ||
      input.auraTier === "eclipse" ||
      input.auraTier === "mythic"
    ) &&
    input.impactQuotient >= 5000;

  return {
    creatorId: input.creatorId,
    auraTier: input.auraTier,
    impactQuotient: input.impactQuotient,
    eligible
  };
}
