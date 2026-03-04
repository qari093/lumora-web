export type PortalStatus = "active" | "inactive";

export interface PortalDefinition {
  id: string;
  title: string;
  route: string;
  status: PortalStatus;
}

export const PORTALS: readonly PortalDefinition[] = Object.freeze([
  { id: "fyp", title: "Flow", route: "/", status: "active" },
  { id: "gmar", title: "GMAR", route: "/gmar", status: "active" },
  { id: "nexa", title: "NEXA", route: "/nexa", status: "active" },
  { id: "videos", title: "Videos", route: "/videos", status: "active" },
  { id: "movies", title: "Movies", route: "/movies", status: "active" },
  { id: "echo", title: "Echo", route: "/echo", status: "active" },
  { id: "celebrations", title: "Celebrations", route: "/celebrations", status: "active" },
  { id: "share", title: "Share", route: "/share", status: "active" }
]);
