export type NexaIndex = {
  ok: true;
  ts: number;
  service: "nexa";
  routes: Array<{
    path: string;
    method: "GET";
    desc: string;
  }>;
};

export function getNexaIndex(): NexaIndex {
  return {
    ok: true,
    ts: Date.now(),
    service: "nexa",
    routes: [
      { path: "/api/nexa/health", method: "GET", desc: "Health status (runtime)" },
      { path: "/api/nexa/metrics", method: "GET", desc: "Runtime metrics snapshot" },
      { path: "/api/nexa/diag", method: "GET", desc: "Diagnostics (health + metrics, partial-safe)" },
      { path: "/api/nexa/info", method: "GET", desc: "Environment + node version info" },
      { path: "/api/nexa", method: "GET", desc: "This index" },
    ],
  };
}
