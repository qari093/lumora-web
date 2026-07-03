import type { UniversalShareDestination } from "./destinations";

export type ShareDestinationGroup = {
  id: string;
  label: string;
  destinations: UniversalShareDestination[];
};

export function groupShareDestinations(destinations: UniversalShareDestination[]): ShareDestinationGroup[] {
  const labels: Record<string, string> = {
    portal: "Lumora Portals",
    person: "People",
    group: "Groups",
    community: "Communities",
    external: "Outside Lumora",
    system: "System",
  };

  return ["portal", "person", "group", "community", "external", "system"]
    .map((kind) => ({
      id: kind,
      label: labels[kind] ?? kind,
      destinations: destinations.filter((destination) => destination.kind === kind),
    }))
    .filter((group) => group.destinations.length > 0);
}
