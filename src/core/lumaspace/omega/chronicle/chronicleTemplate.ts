import type { ChronicleScope, ChronicleTemplate } from "./types";

export function createChronicleTemplate(scope: ChronicleScope): ChronicleTemplate {
  const toneByScope: Record<ChronicleScope, ChronicleTemplate["tone"]> = {
    personal: "quiet_pride",
    community: "celebration",
    relationship: "reflection",
    legacy: "legacy",
  };

  return {
    id: `chronicle_template_${scope}`,
    scope,
    tone: toneByScope[scope],
    maxMoments: scope === "personal" ? 7 : 10,
    musicSeed: `${scope}_ambient_memory_loop`,
  };
}
