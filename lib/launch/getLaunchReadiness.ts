import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export function getLaunchReadiness() {
  const overview = getPortalOverview();

  const checks = [
    { key: "portals_registered", passed: overview.total >= 7 },
    { key: "portals_active", passed: overview.active >= 7 },
    { key: "portals_healthy", passed: overview.healthy >= 7 },
    { key: "fyp_ready", passed: overview.items.some((item) => item.key === "fyp" && item.healthy) },
    { key: "gmar_ready", passed: overview.items.some((item) => item.key === "gmar" && item.healthy) },
    { key: "nexa_ready", passed: overview.items.some((item) => item.key === "nexa" && item.healthy) },
    { key: "cineverse_ready", passed: overview.items.some((item) => item.key === "cineverse" && item.healthy) },
    { key: "live_ready", passed: overview.items.some((item) => item.key === "live" && item.healthy) },
    { key: "wallet_ready", passed: overview.items.some((item) => item.key === "wallet" && item.healthy) },
    { key: "profile_ready", passed: overview.items.some((item) => item.key === "profile" && item.healthy) },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  return {
    status: passed === total ? "ready" : "in_progress",
    passed,
    total,
    score: Number((passed / total).toFixed(4)),
    checks,
  };
}
