import type {
  CollectiveAura,
  VibeForgeSession
} from "./types";

export function generateCollectiveAura(
  session: VibeForgeSession
): CollectiveAura {
  const intensity =
    Math.min(
      100,
      session.creators.length * 20
    );

  return {
    auraId: `collective_${session.forgeId}`,
    forgeId: session.forgeId,
    intensity,
    synchronized: intensity >= 40
  };
}
