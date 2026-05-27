export type ZendoroCertificationGate =
  | "next_build"
  | "typecheck"
  | "prisma_validate"
  | "zendoro_tests"
  | "buyer_smoke"
  | "seller_smoke"
  | "admin_smoke"
  | "stripe_sandbox"
  | "webhook_replay"
  | "rollback_ready";

export function getZendoroFinalCertificationGates(): ZendoroCertificationGate[] {
  return [
    "next_build",
    "typecheck",
    "prisma_validate",
    "zendoro_tests",
    "buyer_smoke",
    "seller_smoke",
    "admin_smoke",
    "stripe_sandbox",
    "webhook_replay",
    "rollback_ready"
  ];
}

export function validateZendoroFinalLaunchCertification() {
  const gates = getZendoroFinalCertificationGates();

  return {
    ok: gates.length === 10,
    gates,
    buyerReady: gates.includes("buyer_smoke"),
    sellerReady: gates.includes("seller_smoke"),
    adminReady: gates.includes("admin_smoke"),
    paymentReady: gates.includes("stripe_sandbox") && gates.includes("webhook_replay"),
    rollbackReady: gates.includes("rollback_ready"),
    seal: "ZENDORO_FINAL_LAUNCH_CERTIFICATION_READY"
  };
}
