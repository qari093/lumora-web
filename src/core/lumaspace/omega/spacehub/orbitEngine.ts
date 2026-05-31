import type { OrbitEntity, OrbitEntityType } from "./types";

export type OrbitEntityInput = {
  id: string;
  type: OrbitEntityType;
  title: string;
  closeness: number;
  activity: number;
  trusted?: boolean;
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function ringForCloseness(closeness: number): OrbitEntity["ring"] {
  if (closeness >= 70) return "inner";
  if (closeness >= 35) return "middle";
  return "outer";
}

function radiusForRing(ring: OrbitEntity["ring"]): number {
  if (ring === "inner") return 92;
  if (ring === "middle") return 148;
  return 210;
}

export function createOrbitEntities(inputs: OrbitEntityInput[]): OrbitEntity[] {
  return inputs.map((item, index) => {
    if (!item.id.trim()) throw new Error("orbit_entity_id_required");

    const closeness = clamp(item.closeness);
    const activity = clamp(item.activity);
    const ring = ringForCloseness(closeness);
    const angle = (Math.PI * 2 * index) / Math.max(1, inputs.length);
    const radius = radiusForRing(ring);

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      closeness,
      activity,
      trusted: item.trusted === true,
      x: Number((Math.cos(angle) * radius).toFixed(2)),
      y: Number((Math.sin(angle) * radius).toFixed(2)),
      ring,
    };
  });
}

export function sortOrbitEntitiesByGravity(entities: OrbitEntity[]): OrbitEntity[] {
  return [...entities].sort((a, b) => {
    const scoreA = a.closeness * 0.7 + a.activity * 0.3 + (a.trusted ? 10 : 0);
    const scoreB = b.closeness * 0.7 + b.activity * 0.3 + (b.trusted ? 10 : 0);
    return scoreB - scoreA;
  });
}

export function summarizeOrbitPulse(entities: OrbitEntity[]): string {
  const active = entities.filter((entity) => entity.activity >= 60).length;
  const trusted = entities.filter((entity) => entity.trusted).length;
  return `${active} active lights, ${trusted} trusted orbits`;
}
