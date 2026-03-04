export type PortalDescriptor = {
  id: string;
  title: string;
  href: string;
  enabled?: boolean;
};

export const PORTALS: PortalDescriptor[] = [
  { id: "fyp", title: "FYP", href: "/" , enabled: true },
  { id: "live", title: "Live", href: "/live", enabled: true },
  { id: "gmar", title: "GMAR", href: "/gmar", enabled: true },
  { id: "nexa", title: "NEXA", href: "/nexa", enabled: true },
  { id: "movies", title: "Movies", href: "/movies", enabled: true },
  { id: "music", title: "Music", href: "/music", enabled: true },
  { id: "celebrations", title: "Celebrations", href: "/celebrations", enabled: true },
];

export function getPortals() {
  return PORTALS;
}
