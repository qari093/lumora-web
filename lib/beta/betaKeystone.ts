export type BetaKeystone = {
  id: string;
  userId: string;
  title: string;
  artifact: "FOUNDING_PRESENCE";
  permanent: true;
  emotionalLegacy: string[];
};

export function createBetaKeystone(userId: string): BetaKeystone {
  const cleanUserId = userId.trim() || "anonymous-founder";
  return {
    id: `keystone_${cleanUserId}_${Date.now()}`,
    userId: cleanUserId,
    title: "Founding Presence",
    artifact: "FOUNDING_PRESENCE",
    permanent: true,
    emotionalLegacy: ["first-presence", "early-civilization", "memory-anchor"],
  };
}
