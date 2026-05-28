export type AtmosphericPortal = {
  id: string;
  active: boolean;
  rarity: "common" | "rare";
  durationSeconds: number;
};

export function createAtmosphericPortal(): AtmosphericPortal {
  return {
    id: "portal-01",
    active: true,
    rarity: "rare",
    durationSeconds: 120
  };
}
