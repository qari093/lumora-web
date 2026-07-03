export type SharePortalRoute = {
  portal: string;
  route: string;
  requiredTrigger: string;
  shareMode: "instant" | "silent" | "echo" | "gift" | "external";
  destination: string;
};

export function createSharePortalRouteMap(): SharePortalRoute[] {
  return [
    { portal: "fyp", route: "/fyp", requiredTrigger: "Share", shareMode: "instant", destination: "lumaspace" },
    { portal: "lumaspace", route: "/lumaspace", requiredTrigger: "Share", shareMode: "silent", destination: "lumalink" },
    { portal: "lumalink", route: "/lumalink", requiredTrigger: "Share", shareMode: "echo", destination: "lumaspace" },
    { portal: "live", route: "/live", requiredTrigger: "Share", shareMode: "instant", destination: "lumalink" },
    { portal: "zendoro", route: "/zendoro", requiredTrigger: "Share", shareMode: "gift", destination: "lumaspace" },
    { portal: "lumexa", route: "/lumexa", requiredTrigger: "Share", shareMode: "external", destination: "external" },
    { portal: "creator_hub", route: "/creator", requiredTrigger: "Share", shareMode: "instant", destination: "community" },
    { portal: "share", route: "/share", requiredTrigger: "Universal Share", shareMode: "instant", destination: "lumaspace" },
  ];
}

export function createPortalShareIntegrationManifest() {
  const routes = createSharePortalRouteMap();

  return {
    version: "usl-visual-route-integration-v1",
    routes,
    totalRoutes: routes.length,
    requiredPortals: routes.map((route) => route.portal),
    fypToLumaSpace: routes.some((route) => route.portal === "fyp" && route.destination === "lumaspace"),
    crossPortalReady: routes.length >= 8,
  };
}

export function validatePortalShareIntegrationManifest(
  manifest: ReturnType<typeof createPortalShareIntegrationManifest>,
) {
  return (
    manifest.version === "usl-visual-route-integration-v1" &&
    manifest.fypToLumaSpace &&
    manifest.crossPortalReady &&
    manifest.requiredPortals.includes("lumaspace") &&
    manifest.requiredPortals.includes("lumalink")
  );
}
