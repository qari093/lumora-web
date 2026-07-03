import type { UniversalShareDestination } from "./destinations";

export function searchShareDestinations(
  destinations: UniversalShareDestination[],
  query: string,
): UniversalShareDestination[] {
  const q = query.trim().toLowerCase();
  if (!q) return destinations;

  return destinations.filter((destination) =>
    [
      destination.id,
      destination.kind,
      destination.portal,
      destination.label,
      destination.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
