import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { getCreatorTrustGateCriteria, passesCreatorTrustGate } from "@/src/lib/creator-system/final-lock/trustGate";
import { getCreatorLedgerStatus } from "@/src/lib/creator-system/final-lock/deferredLedger";
import { buildFutureLedgerDrawer } from "@/src/lib/creator-system/final-lock/futureLedgerDrawer";
import { validateNoBackdoorMonetization } from "@/src/lib/creator-system/final-lock/noBackdoorMonetization";
import { getCreatorSystemSeal } from "@/src/lib/creator-system/final-lock/creatorSystemSeal";

describe("Pack24 Final Lock", () => {
  it("adds trust gate criteria", () => {
    const gate = getCreatorTrustGateCriteria();
    expect(gate.noFakeMetrics).toBe(true);
    expect(passesCreatorTrustGate({ deepEngagement: 3, quietResonance: 2 })).toBe(true);
    expect(passesCreatorTrustGate({ deepEngagement: 1, quietResonance: 2 })).toBe(false);
  });

  it("locks ledger as deferred feature", () => {
    const ledger = getCreatorLedgerStatus();
    expect(ledger.status).toBe("deferred");
    expect(ledger.activationRequiresTrustGate).toBe(true);
  });

  it("connects dashboard to future ledger drawer", () => {
    const drawer = buildFutureLedgerDrawer();
    expect(drawer.connected).toBe(true);
    expect(drawer.visible).toBe(false);
  });

  it("blocks backdoor monetization", () => {
    expect(validateNoBackdoorMonetization("show-soft-hint").ok).toBe(true);
    expect(validateNoBackdoorMonetization("force-payment").ok).toBe(false);
    expect(validateNoBackdoorMonetization("fake-scarcity").ok).toBe(false);
  });

  it("seals creator system canonical state", () => {
    const seal = getCreatorSystemSeal();
    expect(seal.status).toBe("sealed");
    expect(seal.totalSteps).toBe(120);
    expect(seal.canonical).toBe(true);
    expect(fs.existsSync("docs/creator-system/final-canonical-seal.md")).toBe(true);
  });
});
