export type PortalStatus = "active" | "seed" | "mock" | "offline";

export interface PortalDef {
  id: string;
  title: string;
  href: string;
  status: PortalStatus;
}

export function getPortalRegistry(): PortalDef[] {
  const mode = process.env.LUMORA_DATA_MODE || "seed";

  const base: PortalDef[] = [
    { id: "fyp", title: "FYP", href: "/fyp", status: "seed" },
    { id: "videos", title: "Videos", href: "/videos", status: "seed" },
    { id: "gmar", title: "GMAR", href: "/gmar", status: "seed" },
    { id: "nexa", title: "NEXA", href: "/nexa", status: "seed" },
    { id: "live", title: "Live", href: "/live", status: "seed" },
    { id: "celebrations", title: "Celebrations", href: "/celebrations", status: "seed" },
    { id: "share", title: "Share", href: "/share", status: "seed" },
    { id: "movies", title: "Movies", href: "/movies", status: "active" },
    { id: "music", title: "Music", href: "/music", status: "active" },
  ];

  if (mode === "live") {
    return base.map(p => ({ ...p, status: "active" }));
  }

  if (mode === "mock") {
    return base.map(p =>
      p.status === "active" ? p : { ...p, status: "mock" }
    );
  }

  return base;
}
