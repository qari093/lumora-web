export type EmotionalTimeCapsule = {
  id: string;
  ownerId: string;
  sealedAt: string;
  opensAt: string;
  sealed: boolean;
};

export function createAnnualCapsule(id: string, ownerId: string, sealedAt = new Date()): EmotionalTimeCapsule {
  const opensAt = new Date(sealedAt);
  opensAt.setFullYear(opensAt.getFullYear() + 1);

  return {
    id,
    ownerId,
    sealedAt: sealedAt.toISOString(),
    opensAt: opensAt.toISOString(),
    sealed: true,
  };
}
