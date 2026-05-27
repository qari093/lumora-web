import type { LaunchRouteExposure, LaunchRouteKind } from "./types";

export function inferLaunchRouteKind(file: string): LaunchRouteKind {
  return file.includes("/api/") ? "api" : "page";
}

export function routePathFromAppFile(file: string): string {
  let route = file
    .replace(/^app/, "")
    .replace(/\/route\.(ts|tsx|js|jsx)$/, "")
    .replace(/\/page\.(ts|tsx|js|jsx)$/, "")
    .replace(/\([^)]*\)\//g, "")
    .replace(/\/index$/, "");

  route = route.replace(/\[(.*?)\]/g, "[$1]");
  return route === "" ? "/" : route;
}

export function inferExposure(path: string): LaunchRouteExposure {
  if (path.includes("/admin") || path.includes("/mod/")) return "admin";
  if (path.includes("/diag") || path.includes("/debug") || path.includes("/dev/")) return "diagnostic";
  if (
    path.includes("/api/runtime-consolidation") ||
    path.includes("/api/infra") ||
    path.includes("/api/trust") ||
    path.includes("/api/security") ||
    path.includes("/api/private")
  ) return "internal";

  if (path === "/" || path.startsWith("/api/") || path.startsWith("/fyp") || path.startsWith("/live") || path.startsWith("/gmar") || path.startsWith("/creator") || path.startsWith("/share") || path.startsWith("/cineverse") || path.startsWith("/music") || path.startsWith("/movies")) {
    return "public";
  }

  return "unknown";
}

export function inferRouteDomain(path: string): string {
  const pairs: Array<[string, string]> = [
    ["/api/creator-alchemy", "creator_alchemy"],
    ["/creator", "creator"],
    ["/api/fyp", "fyp"],
    ["/fyp", "fyp"],
    ["/api/live", "live"],
    ["/live", "live"],
    ["/api/gmar", "gmar"],
    ["/gmar", "gmar"],
    ["/api/wallet", "wallet"],
    ["/api/coin", "wallet"],
    ["/api/feed", "feed"],
    ["/api/content", "content"],
    ["/api/signals", "signals"],
    ["/api/trust", "trust_safety"],
    ["/api/safety", "trust_safety"],
    ["/api/infra", "infra"],
    ["/api/runtime-consolidation", "runtime_consolidation"],
    ["/api/movies", "movies"],
    ["/movies", "movies"],
    ["/api/music", "music"],
    ["/music", "music"],
    ["/api/share", "share"],
    ["/share", "share"],
    ["/api/products", "commerce"],
    ["/api/orders", "commerce"],
    ["/api/payments", "commerce"]
  ];

  return pairs.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[1] ?? "unknown";
}

export function isDeprecatedLaunchRoute(path: string): boolean {
  return [
    "/api/coin",
    "/api/wallets",
    "/api/fyp94",
    "/api/content-engine",
    "/api/live/roomlist",
    "/api/live/roomslist",
    "/api/shop"
  ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function isCanonicalLaunchRoute(path: string): boolean {
  return !isDeprecatedLaunchRoute(path) && inferRouteDomain(path) !== "unknown";
}

export function isRiskyPublicExposure(path: string, exposure: LaunchRouteExposure): boolean {
  if (exposure !== "public") return false;
  return path.includes("/debug") || path.includes("/diag") || path.includes("/dev") || path.includes("/admin") || path.includes("/private");
}
