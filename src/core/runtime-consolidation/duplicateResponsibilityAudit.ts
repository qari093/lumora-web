import type { RuntimeRouteRecord } from "./domainRegistry";
import { buildRouteInventoryReport, scanRuntimeRoutes } from "./routeInventory";
import { getDeprecatedCanonicalTarget, isCanonicalRoute } from "./domainOwnership";

export type DuplicateRisk = "low" | "medium" | "high";

export interface ResponsibilityCluster {
  responsibility: string;
  canonicalDomain: string;
  routePrefixes: string[];
  risk: DuplicateRisk;
  reason: string;
}

export interface DuplicateRouteFinding {
  route: string;
  matchedCluster: string;
  canonicalDomain: string;
  canonical: boolean;
  deprecatedAlias: boolean;
  canonicalTarget: string | null;
  risk: DuplicateRisk;
}

export interface DuplicateResponsibilityAuditReport {
  generatedAt: string;
  clusterCount: number;
  findingCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  deprecatedAliasCount: number;
  clusters: ResponsibilityCluster[];
  findings: DuplicateRouteFinding[];
}

export const RESPONSIBILITY_CLUSTERS: ResponsibilityCluster[] = [
  {
    responsibility: "feed_assembly",
    canonicalDomain: "fyp",
    routePrefixes: ["/api/fyp", "/api/feed", "/api/content/multi-source", "/api/fyp94"],
    risk: "high",
    reason: "FYP, generic feed, content multi-source and FYP94 routes can compete for feed assembly."
  },
  {
    responsibility: "ranking_scoring",
    canonicalDomain: "intelligence",
    routePrefixes: ["/api/intelligence", "/api/feed/ranking", "/api/fyp/ranking", "/api/profile", "/api/feedback/scoring"],
    risk: "high",
    reason: "Ranking, scoring and profile-derived scoring must flow through intelligence orchestration."
  },
  {
    responsibility: "personalization_profile",
    canonicalDomain: "personalization",
    routePrefixes: ["/api/personalization", "/api/profile", "/api/context"],
    risk: "medium",
    reason: "Profile and personalization routes can duplicate user-state interpretation."
  },
  {
    responsibility: "external_signal_ingestion",
    canonicalDomain: "signals",
    routePrefixes: ["/api/signals", "/api/ingest", "/api/news", "/api/live/google-trends"],
    risk: "medium",
    reason: "External trend/news/social signal ingestion needs a single normalization boundary."
  },
  {
    responsibility: "wallet_ledger",
    canonicalDomain: "wallet",
    routePrefixes: ["/api/wallet", "/api/wallets", "/api/coin", "/api/ledger"],
    risk: "high",
    reason: "Ledger write paths must be centralized to avoid balance drift."
  },
  {
    responsibility: "trust_safety_moderation",
    canonicalDomain: "trust_safety",
    routePrefixes: ["/api/trust", "/api/safety", "/api/security", "/api/moderation", "/api/mod"],
    risk: "high",
    reason: "Safety, trust and moderation enforcement must share canonical policy."
  },
  {
    responsibility: "live_room_runtime",
    canonicalDomain: "live",
    routePrefixes: ["/api/live/room", "/api/live/rooms", "/api/live/roomlist", "/api/live/roomslist", "/api/live/room-state"],
    risk: "medium",
    reason: "Live room naming drift can create duplicate room state paths."
  },
  {
    responsibility: "media_catalog_runtime",
    canonicalDomain: "media",
    routePrefixes: ["/api/video", "/api/videos", "/api/movies", "/api/music", "/api/cineverse"],
    risk: "medium",
    reason: "Video, movies, music and CineVerse need clear media orchestration boundaries."
  },
  {
    responsibility: "commerce_orders_payments",
    canonicalDomain: "commerce",
    routePrefixes: ["/api/products", "/api/orders", "/api/payments", "/api/shop", "/api/seller", "/api/vendor"],
    risk: "medium",
    reason: "Commerce routes need one transaction ownership layer."
  }
];

export function auditDuplicateResponsibilities(routes: RuntimeRouteRecord[] = scanRuntimeRoutes()): DuplicateResponsibilityAuditReport {
  const findings: DuplicateRouteFinding[] = [];

  for (const route of routes) {
    for (const cluster of RESPONSIBILITY_CLUSTERS) {
      if (cluster.routePrefixes.some((prefix) => route.path === prefix || route.path.startsWith(`${prefix}/`))) {
        findings.push({
          route: route.path,
          matchedCluster: cluster.responsibility,
          canonicalDomain: cluster.canonicalDomain,
          canonical: isCanonicalRoute(route.path),
          deprecatedAlias: getDeprecatedCanonicalTarget(route.path) !== null,
          canonicalTarget: getDeprecatedCanonicalTarget(route.path),
          risk: cluster.risk
        });
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    clusterCount: RESPONSIBILITY_CLUSTERS.length,
    findingCount: findings.length,
    highRiskCount: findings.filter((finding) => finding.risk === "high" && !finding.canonical).length,
    mediumRiskCount: findings.filter((finding) => finding.risk === "medium" && !finding.canonical).length,
    deprecatedAliasCount: findings.filter((finding) => finding.deprecatedAlias).length,
    clusters: RESPONSIBILITY_CLUSTERS,
    findings
  };
}

export function summarizeDuplicateAudit() {
  const inventory = buildRouteInventoryReport(scanRuntimeRoutes());
  const audit = auditDuplicateResponsibilities(inventory.routes);

  return {
    totalRoutes: inventory.summary.total,
    auditedFindings: audit.findingCount,
    highRiskCount: audit.highRiskCount,
    mediumRiskCount: audit.mediumRiskCount,
    deprecatedAliasCount: audit.deprecatedAliasCount
  };
}
