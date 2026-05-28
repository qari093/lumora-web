export type LumoraRuntimePortal = {
  id: string;
  label: string;
  href: string;
  api: string;
  status: "mounted" | "degraded";
};

export const lumoraRuntimePortals: LumoraRuntimePortal[] = [
  { id: "fyp", label: "FYP", href: "/fyp", api: "/api/fyp/health", status: "mounted" },
  { id: "live", label: "Live", href: "/live", api: "/api/live/health", status: "mounted" },
  { id: "gmar", label: "GMAR", href: "/gmar", api: "/api/gmar/health", status: "mounted" },
  { id: "nexa", label: "NEXA", href: "/nexa", api: "/api/nexa/health", status: "mounted" },
  { id: "cineverse", label: "CineVerse", href: "/cineverse", api: "/api/movies/health", status: "mounted" },
  { id: "echo", label: "Echo", href: "/echo", api: "/api/music/health", status: "mounted" },
  { id: "zendoro", label: "Zendoro", href: "/zendoro", api: "/api/zendoro/products", status: "mounted" },
  { id: "zenwallet", label: "Zenwallet", href: "/zenwallet", api: "/api/wallet/summary", status: "mounted" },
  { id: "creator-hub", label: "Creator Hub", href: "/creator-hub", api: "/api/creator/hub", status: "mounted" }
];

export function getLumoraRuntimeSummary() {
  return {
    ok: true,
    app: "Lumora",
    visualShell: "recovered",
    runtimeState: "mounted",
    portalCount: lumoraRuntimePortals.length,
    portals: lumoraRuntimePortals,
    checkedAt: new Date().toISOString()
  };
}
