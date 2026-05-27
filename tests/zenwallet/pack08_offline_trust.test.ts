import { describe, expect, it } from "vitest";
import { createOfflineCertificate, queueOfflineSpend, replayOfflineJournal } from "@/src/core/zenwallet/offline/offlineTrust";

describe("ZenWallet Pack 08 — Offline Trust System", () => {
  it("creates signed offline certificates", () => {
    const cert = createOfflineCertificate("wallet_001", 30);
    expect(cert.signature).toContain("sig_");
    expect(cert.spendCap).toBe(30);
  });

  it("queues offline spends within certificate cap", () => {
    const cert = createOfflineCertificate("wallet_002", 30);
    expect(queueOfflineSpend(cert, 10).status).toBe("queued");
    expect(queueOfflineSpend(cert, 25).status).toBe("declined");
  });

  it("replays journal safely", () => {
    const replay = replayOfflineJournal();
    expect(Array.isArray(replay)).toBe(true);
  });
});
