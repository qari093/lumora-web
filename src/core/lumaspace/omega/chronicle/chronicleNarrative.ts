import type { ChronicleMoment, ChronicleScope } from "./types";

export function createChronicleNarration(input: {
  ownerName: string;
  scope: ChronicleScope;
  moments: ChronicleMoment[];
}): string {
  const top = input.moments[0];

  if (!top) {
    return `This month, ${input.ownerName}'s Space stayed quiet, waiting for the next light.`;
  }

  const scopeText: Record<ChronicleScope, string> = {
    personal: "your Space kept growing through small acts of meaning",
    community: "your community gathered around shared light",
    relationship: "a bridge deepened through memory and trust",
    legacy: "your story added another lasting branch",
  };

  return `This month, ${scopeText[input.scope]}. ${top.title} became one of the brightest moments. From your Space, with quiet pride.`;
}
