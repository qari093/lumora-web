export type RuntimeDomain =
  | "creator_alchemy"
  | "fyp"
  | "feed"
  | "content"
  | "signals"
  | "intelligence"
  | "personalization"
  | "live"
  | "wallet"
  | "trust_safety"
  | "infra_telemetry"
  | "commerce"
  | "gmar"
  | "lumaspace"
  | "media"
  | "unknown";

export type RuntimeExposure = "public" | "internal" | "demo" | "deprecated" | "unknown";

export interface RuntimeRouteRecord {
  path: string;
  kind: "api" | "page";
  domain: RuntimeDomain;
  exposure: RuntimeExposure;
  runtime: "edge" | "node" | "static" | "dynamic" | "unknown";
}

export const RUNTIME_DOMAIN_PREFIXES: Array<{
  prefix: string;
  domain: RuntimeDomain;
}> = [
  { prefix: "/api/creator-alchemy", domain: "creator_alchemy" },
  { prefix: "/creator-hub", domain: "creator_alchemy" },
  { prefix: "/api/fyp", domain: "fyp" },
  { prefix: "/fyp", domain: "fyp" },
  { prefix: "/api/feed", domain: "feed" },
  { prefix: "/api/content", domain: "content" },
  { prefix: "/api/signals", domain: "signals" },
  { prefix: "/api/intelligence", domain: "intelligence" },
  { prefix: "/api/personalization", domain: "personalization" },
  { prefix: "/api/live", domain: "live" },
  { prefix: "/live", domain: "live" },
  { prefix: "/api/wallet", domain: "wallet" },
  { prefix: "/api/wallets", domain: "wallet" },
  { prefix: "/api/coin", domain: "wallet" },
  { prefix: "/api/trust", domain: "trust_safety" },
  { prefix: "/api/safety", domain: "trust_safety" },
  { prefix: "/api/security", domain: "trust_safety" },
  { prefix: "/api/infra", domain: "infra_telemetry" },
  { prefix: "/api/telemetry", domain: "infra_telemetry" },
  { prefix: "/api/diag", domain: "infra_telemetry" },
  { prefix: "/api/products", domain: "commerce" },
  { prefix: "/api/orders", domain: "commerce" },
  { prefix: "/api/payments", domain: "commerce" },
  { prefix: "/api/seller", domain: "commerce" },
  { prefix: "/api/vendor", domain: "commerce" },
  { prefix: "/api/gmar", domain: "gmar" },
  { prefix: "/gmar", domain: "gmar" },
  { prefix: "/api/lumaspace", domain: "lumaspace" },
  { prefix: "/lumaspace", domain: "lumaspace" },
  { prefix: "/api/video", domain: "media" },
  { prefix: "/api/videos", domain: "media" },
  { prefix: "/api/movies", domain: "media" },
  { prefix: "/api/music", domain: "media" },
  { prefix: "/api/cineverse", domain: "media" }
];

export function inferRuntimeDomain(path: string): RuntimeDomain {
  const normalized = normalizeRoutePath(path);
  const hit = RUNTIME_DOMAIN_PREFIXES
    .slice()
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((item) => normalized === item.prefix || normalized.startsWith(`${item.prefix}/`));

  return hit?.domain ?? "unknown";
}

export function inferRuntimeExposure(path: string): RuntimeExposure {
  const lower = path.toLowerCase();

  if (lower.includes("/demo") || lower.includes("/mock") || lower.includes("/debug") || lower.includes("/dev/")) {
    return "demo";
  }

  if (lower.includes("/internal") || lower.includes("/diag") || lower.includes("/admin")) {
    return "internal";
  }

  if (lower.includes("/deprecated") || lower.includes("/legacy")) {
    return "deprecated";
  }

  return "public";
}

export function normalizeRoutePath(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

export function createRuntimeRouteRecord(input: {
  path: string;
  kind: "api" | "page";
  runtime?: RuntimeRouteRecord["runtime"];
}): RuntimeRouteRecord {
  const path = normalizeRoutePath(input.path);

  return {
    path,
    kind: input.kind,
    domain: inferRuntimeDomain(path),
    exposure: inferRuntimeExposure(path),
    runtime: input.runtime ?? "unknown"
  };
}
