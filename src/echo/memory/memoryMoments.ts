export const memorySystems = [
  "moments",
  "capsules",
  "memory-trails",
  "postcards"
] as const;

export function saveMoment() {
  return {
    saved: true,
    emotional: true
  };
}
