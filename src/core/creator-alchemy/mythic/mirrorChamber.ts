import type { MirrorChamberSession } from "./types";

export function createMirrorChamberSession(input: {
  works: string[];
  monthsSinceLastSession: number;
}): MirrorChamberSession {
  const eligible = input.monthsSinceLastSession >= 12 && input.works.length >= 3;

  return {
    eligible,
    works: eligible ? input.works.slice(0, 10) : [],
    metricsHidden: true,
    notificationsHidden: true,
    reflectionQuestion: "In this silence, what did you feel about yourself?"
  };
}
