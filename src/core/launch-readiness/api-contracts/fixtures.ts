export interface ApiRouteFixture {
  route: string;
  domain: string;
  implementation: string;
}

export const API_ROUTE_FIXTURES: ApiRouteFixture[] = [
  {
    route: "/api/wallet/credit",
    domain: "wallet",
    implementation: `
      return {
        ok: true,
        requestId: "req_123",
        version: "v1",
        meta: { domain: "wallet" },
        data: {}
      };
    `
  },
  {
    route: "/api/feed/final",
    domain: "fyp",
    implementation: `
      return {
        ok: true,
        requestId: "req_456",
        version: "v2",
        meta: { domain: "fyp" },
        data: {}
      };
    `
  },
  {
    route: "/api/legacy/raw-wallet",
    domain: "wallet",
    implementation: `
      return {
        success: true,
        raw: true
      };
    `
  },
  {
    route: "/api/live/room",
    domain: "live",
    implementation: `
      return {
        ok: true,
        requestId: "req_live",
        version: "v1",
        data: {}
      };
    `
  }
];
