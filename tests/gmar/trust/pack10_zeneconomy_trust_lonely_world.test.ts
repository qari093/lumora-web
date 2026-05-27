import { describe, expect, it } from "vitest";

import {
  isZenEconomyUseAllowed,
  zenEconomyUsePolicyHealthy,
} from "../../../src/core/gmar/zeneconomy/allowedUses";

import {
  validateZenEconomyTransaction,
} from "../../../src/core/gmar/zeneconomy/transactionGuard";

import {
  createGmarEmotionalContract,
  gmarEmotionalContractHealthy,
} from "../../../src/core/gmar/trust/emotionalContract";

import {
  createResonancePrivacyState,
  resonancePrivacyHealthy,
} from "../../../src/core/gmar/trust/resonancePrivacy";

import {
  auditEntryHealthy,
  createGmarAuditEntry,
} from "../../../src/core/gmar/trust/auditLedger";

import {
  createLonelyWorldResponse,
  lonelyWorldHealthy,
} from "../../../src/core/gmar/lonely-world/scripts";

import {
  createGmarTrustSeal,
} from "../../../src/core/gmar/trust/finalTrustSeal";

describe("GMAR Pack 10 — ZenEconomy + Trust + Lonely World", () => {
  it("allows only expressive ZenEconomy uses", () => {
    expect(zenEconomyUsePolicyHealthy()).toBe(true);
    expect(isZenEconomyUseAllowed("memory_orb")).toBe(true);
    expect(isZenEconomyUseAllowed("power_boost")).toBe(false);
    expect(isZenEconomyUseAllowed("loot_box")).toBe(false);
  });

  it("blocks unethical transactions", () => {
    const blocked = validateZenEconomyTransaction({
      userId: "u1",
      use: "power_boost",
      amount: 100,
    });

    expect(blocked.approved).toBe(false);
    expect(blocked.reason).toBe("blocked_by_ethics_policy");
  });

  it("approves expressive transactions", () => {
    const approved = validateZenEconomyTransaction({
      userId: "u1",
      use: "solace_coin",
      amount: 4.99,
    });

    expect(approved.approved).toBe(true);
    expect(approved.reason).toBe("approved_expression_only");
  });

  it("validates emotional contract", () => {
    const contract = createGmarEmotionalContract();

    expect(gmarEmotionalContractHealthy(contract)).toBe(true);
    expect(contract.noPowerSelling).toBe(true);
    expect(contract.noEmotionalSpendingTargeting).toBe(true);
  });

  it("validates resonance privacy", () => {
    const privacy = createResonancePrivacyState();

    expect(resonancePrivacyHealthy(privacy)).toBe(true);
    expect(privacy.deleteAllowed).toBe(true);
    expect(privacy.spendingTargetingAllowed).toBe(false);
  });

  it("creates public audit entries", () => {
    const entry = createGmarAuditEntry("audit-1", "economy", "Power selling remains blocked.");

    expect(auditEntryHealthy(entry)).toBe(true);
    expect(entry.public).toBe(true);
  });

  it("turns lonely-world states into presence without manipulation", () => {
    const response = createLonelyWorldResponse("empty_seed_world");

    expect(response.text).toContain("civilization");
    expect(response.turnsEmptinessIntoPresence).toBe(true);
    expect(response.manipulative).toBe(false);
    expect(lonelyWorldHealthy()).toBe(true);
  });

  it("creates final trust seal", () => {
    const seal = createGmarTrustSeal();

    expect(seal.system).toBe("GMAR Trust Seal");
    expect(seal.status).toBe("PASS");
    expect(seal.zeneconomySafe).toBe(true);
    expect(seal.emotionalContractSafe).toBe(true);
    expect(seal.resonancePrivacySafe).toBe(true);
    expect(seal.lonelyWorldSafe).toBe(true);
  });
});
