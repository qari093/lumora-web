import type { RuntimeDomain } from "./domainRegistry";
import { buildRouteInventoryReport, scanRuntimeRoutes } from "./routeInventory";
import {
  getDeprecatedCanonicalTarget,
  getDomainOwner,
  isCanonicalRoute,
  RUNTIME_DOMAIN_OWNERS
} from "./domainOwnership";

export interface DomainOwnershipReport {
  generatedAt: string;
  domainCount: number;
  canonicalRouteCount: number;
  deprecatedAliasCount: number;
  unknownDomainRoutes: number;
  owners: typeof RUNTIME_DOMAIN_OWNERS;
  coverage: Record<RuntimeDomain, {
    owner: string;
    routes: number;
    canonicalRoutes: number;
    deprecatedAliases: number;
  }>;
}

export function buildDomainOwnershipReport(): DomainOwnershipReport {
  const inventory = buildRouteInventoryReport(scanRuntimeRoutes());
  const coverage = {} as DomainOwnershipReport["coverage"];

  for (const owner of RUNTIME_DOMAIN_OWNERS) {
    const routes = inventory.routes.filter((route) => route.domain === owner.domain);
    coverage[owner.domain] = {
      owner: owner.owner,
      routes: routes.length,
      canonicalRoutes: routes.filter((route) => isCanonicalRoute(route.path)).length,
      deprecatedAliases: routes.filter((route) => getDeprecatedCanonicalTarget(route.path) !== null).length
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    domainCount: RUNTIME_DOMAIN_OWNERS.length,
    canonicalRouteCount: RUNTIME_DOMAIN_OWNERS.reduce((sum, owner) => sum + owner.canonicalRoutes.length, 0),
    deprecatedAliasCount: RUNTIME_DOMAIN_OWNERS.reduce((sum, owner) => sum + owner.deprecatedPrefixes.length, 0),
    unknownDomainRoutes: inventory.summary.unknownDomainRoutes,
    owners: RUNTIME_DOMAIN_OWNERS,
    coverage
  };
}

export function assertKnownDomainOwner(domain: RuntimeDomain): boolean {
  return getDomainOwner(domain).domain === domain;
}
