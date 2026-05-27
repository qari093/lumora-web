import { describe, expect, it } from "vitest";
import { initializeWallet } from "@/src/core/zenwallet/orchestration/walletOrchestrator";
import { getWalletRegistrySize } from "@/src/core/zenwallet/registry/walletRegistry";
import { getWalletEvents } from "@/src/core/zenwallet/events/eventBus";

describe("ZenWallet Pack 02", () => {
  it("initializes wallet runtime", () => {
    const wallet = initializeWallet("wallet_001");

    expect(wallet.walletId).toBe("wallet_001");
    expect(wallet.state).toBe("active");
  });

  it("tracks registry state", () => {
    expect(getWalletRegistrySize()).toBeGreaterThan(0);
  });

  it("emits runtime events", () => {
    expect(getWalletEvents().length).toBeGreaterThan(0);
  });
});
