export type LaunchRouteKind = "api" | "page";
export type LaunchRouteExposure = "public" | "internal" | "admin" | "diagnostic" | "unknown";

export interface LaunchRouteRecord {
  path: string;
  file: string;
  kind: LaunchRouteKind;
  exposure: LaunchRouteExposure;
  domain: string;
  canonical: boolean;
  deprecated: boolean;
  riskyPublicExposure: boolean;
}

export interface LaunchRouteRealityReport {
  generatedAt: string;
  status: "PASS" | "WARNING" | "FAILED";
  totalRoutes: number;
  apiRoutes: number;
  pageRoutes: number;
  unknownExposureRoutes: number;
  deprecatedRoutes: number;
  riskyPublicRoutes: number;
  canonicalRoutes: number;
  orphanCandidates: string[];
  duplicatePublicEndpoints: string[];
  routes: LaunchRouteRecord[];
}
