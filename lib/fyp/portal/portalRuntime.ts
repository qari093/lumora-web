export type AtmosphericPortal = {
  id: string;
  optional: boolean;
  maxPerSession: number;
};

export function createAtmosphericPortal(): AtmosphericPortal {
  return { id: "atmospheric-portal", optional: true, maxPerSession: 1 };
}
