export type IdentitySignature = {
  userId: string;
  title: string;
  energyType: string;
  generatedAt: number;
};

export function generateIdentitySignature(input: {
  userId: string;
  chaosHours: number;
  driftHours: number;
  deepHours: number;
}): IdentitySignature {
  if (!input.userId.trim()) {
    throw new Error("Identity signature requires userId.");
  }

  const energyType =
    input.chaosHours > input.deepHours
      ? "electric"
      : "introspective";

  const title =
    input.driftHours >= 10
      ? "Nocturnal Architect"
      : "Pulse Wanderer";

  return {
    userId: input.userId,
    title,
    energyType,
    generatedAt: Date.now()
  };
}
