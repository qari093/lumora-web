import type { RuntimeDomain } from "./domainRegistry";

export interface RuntimeDomainOwner {
  domain: RuntimeDomain;
  canonicalPrefix: string;
  owner: string;
  responsibility: string;
  canonicalRoutes: string[];
  deprecatedPrefixes: string[];
}

export const RUNTIME_DOMAIN_OWNERS: RuntimeDomainOwner[] = [
  {
    domain: "creator_alchemy",
    canonicalPrefix: "/api/creator-alchemy",
    owner: "Creator Alchemy Orchestrator",
    responsibility: "Creator Hub, quiet gifts, creator rituals, creator economy, dashboard runtime.",
    canonicalRoutes: ["/creator-hub", "/api/creator-alchemy/dashboard", "/api/creator-alchemy/final-readiness"],
    deprecatedPrefixes: ["/api/creator/hub"]
  },
  {
    domain: "fyp",
    canonicalPrefix: "/api/fyp",
    owner: "FYP Orchestrator",
    responsibility: "Native FYP assembly, runtime playback, ranking, personalization handoff.",
    canonicalRoutes: ["/api/fyp/feed", "/api/fyp/native-feed", "/api/fyp/runtime"],
    deprecatedPrefixes: ["/api/feed/fyp", "/api/fyp94"]
  },
  {
    domain: "feed",
    canonicalPrefix: "/api/feed",
    owner: "Feed Orchestrator",
    responsibility: "General feed assembly, mix, freshness, diversity and feed-level guardrails.",
    canonicalRoutes: ["/api/feed/final", "/api/feed/assemble", "/api/feed/ranking"],
    deprecatedPrefixes: ["/api/content/multi-source/feed"]
  },
  {
    domain: "content",
    canonicalPrefix: "/api/content",
    owner: "Content Orchestrator",
    responsibility: "Content metadata, lifecycle, trust, schema and origin tracking.",
    canonicalRoutes: ["/api/content/schema", "/api/content/origin", "/api/content/lifecycle"],
    deprecatedPrefixes: ["/api/content-engine"]
  },
  {
    domain: "signals",
    canonicalPrefix: "/api/signals",
    owner: "Signals Orchestrator",
    responsibility: "External signal ingestion, normalization, scoring and freshness.",
    canonicalRoutes: ["/api/signals/normalize", "/api/signals/score", "/api/signals/store"],
    deprecatedPrefixes: ["/api/ingest/trends"]
  },
  {
    domain: "intelligence",
    canonicalPrefix: "/api/intelligence",
    owner: "Intelligence Orchestrator",
    responsibility: "Scoring, clustering, emotion, weights, ranking compute and trend intelligence.",
    canonicalRoutes: ["/api/intelligence/ranking-compute", "/api/intelligence/emotion", "/api/intelligence/weights"],
    deprecatedPrefixes: ["/api/profile/emotion"]
  },
  {
    domain: "personalization",
    canonicalPrefix: "/api/personalization",
    owner: "Personalization Orchestrator",
    responsibility: "Interest graph, session learning, pacing, diversity and short-term intent.",
    canonicalRoutes: ["/api/personalization/interest-graph", "/api/personalization/session-learning", "/api/personalization/pacing-model"],
    deprecatedPrefixes: ["/api/profile/interests"]
  },
  {
    domain: "live",
    canonicalPrefix: "/api/live",
    owner: "Live Orchestrator",
    responsibility: "Live rooms, room events, room state, reactions, live feed and live publishing.",
    canonicalRoutes: ["/api/live/rooms", "/api/live/room-state", "/api/live/events"],
    deprecatedPrefixes: ["/api/live/roomlist", "/api/live/roomslist"]
  },
  {
    domain: "wallet",
    canonicalPrefix: "/api/wallet",
    owner: "Wallet Orchestrator",
    responsibility: "Wallet balances, ledger, credit/debit, transfers, withdrawals and payout readiness.",
    canonicalRoutes: ["/api/wallet/balance", "/api/wallet/ledger", "/api/wallet/withdraw"],
    deprecatedPrefixes: ["/api/coin", "/api/wallets"]
  },
  {
    domain: "trust_safety",
    canonicalPrefix: "/api/trust",
    owner: "Trust Safety Orchestrator",
    responsibility: "Trust, moderation, abuse checks, safety, fraud and enforcement boundaries.",
    canonicalRoutes: ["/api/trust/score", "/api/trust/audit", "/api/safety/validation"],
    deprecatedPrefixes: ["/api/security/check"]
  },
  {
    domain: "infra_telemetry",
    canonicalPrefix: "/api/infra",
    owner: "Infra Telemetry Orchestrator",
    responsibility: "Cost, monitoring, tracing, diagnostics, alerting and runtime health.",
    canonicalRoutes: ["/api/infra/cost", "/api/infra/monitoring", "/api/telemetry/track"],
    deprecatedPrefixes: ["/api/diag"]
  },
  {
    domain: "commerce",
    canonicalPrefix: "/api/products",
    owner: "Commerce Orchestrator",
    responsibility: "Products, orders, sellers, vendors, payments and Zendoro bridge.",
    canonicalRoutes: ["/api/products", "/api/orders", "/api/payments/checkout"],
    deprecatedPrefixes: ["/api/shop"]
  },
  {
    domain: "gmar",
    canonicalPrefix: "/api/gmar",
    owner: "GMAR Orchestrator",
    responsibility: "GMAR gameplay, state, onboarding, missions, economy and launch readiness.",
    canonicalRoutes: ["/gmar", "/api/gmar/state/init", "/api/gmar/ready"],
    deprecatedPrefixes: ["/api/gmar/home"]
  },
  {
    domain: "lumaspace",
    canonicalPrefix: "/api/lumaspace",
    owner: "LumaSpace Orchestrator",
    responsibility: "LumaSpace state, reflection, shadow, tree, runtime and civilization layers.",
    canonicalRoutes: ["/api/lumaspace/runtime", "/api/lumaspace/state", "/api/lumaspace/reflection"],
    deprecatedPrefixes: []
  },
  {
    domain: "media",
    canonicalPrefix: "/api/video",
    owner: "Media Orchestrator",
    responsibility: "Video, movies, music, CineVerse, media upload, preview and playback readiness.",
    canonicalRoutes: ["/api/video/health", "/api/videos/feed", "/api/movies/catalog", "/api/music/catalog"],
    deprecatedPrefixes: ["/api/cineverse/list"]
  },
  {
    domain: "unknown",
    canonicalPrefix: "/api/runtime-consolidation",
    owner: "Runtime Consolidation Orchestrator",
    responsibility: "Unknown routes must be classified before production activation.",
    canonicalRoutes: ["/api/runtime-consolidation/route-inventory"],
    deprecatedPrefixes: []
  }
];

export function getDomainOwner(domain: RuntimeDomain): RuntimeDomainOwner {
  return RUNTIME_DOMAIN_OWNERS.find((owner) => owner.domain === domain) ?? RUNTIME_DOMAIN_OWNERS[RUNTIME_DOMAIN_OWNERS.length - 1];
}

export function isCanonicalRoute(path: string): boolean {
  return RUNTIME_DOMAIN_OWNERS.some((owner) =>
    owner.canonicalRoutes.some((route) => path === route || path.startsWith(`${route}/`))
  );
}

export function getDeprecatedCanonicalTarget(path: string): string | null {
  const owner = RUNTIME_DOMAIN_OWNERS.find((item) =>
    item.deprecatedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  );

  return owner?.canonicalPrefix ?? null;
}
