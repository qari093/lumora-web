import { describe, expect, it } from "vitest";
import { FYP94_DEFAULT_VAULT_THRESHOLD, isFyp94VaultEligible } from "../../src/lib/fyp94/vault/eligibility";
import { selectFyp94VaultClips } from "../../src/lib/fyp94/vault/select";
import { createFyp94PulseVault, relockFyp94PulseVault, unlockFyp94PulseVault } from "../../src/lib/fyp94/vault/window";
import { recycleFyp94VaultClipsToPool } from "../../src/lib/fyp94/vault/recycle";

const clips = [
  { id: "1", title: "a", category: "surf", thrillScore: 90 },
  { id: "2", title: "b", category: "bike", thrillScore: 80 },
  { id: "3", title: "c", category: "travel", thrillScore: 40 },
];

describe("FYP 9.4 Pack 014 — Pulse Vault", () => {
  it("defines vault eligibility threshold", () => {
    expect(FYP94_DEFAULT_VAULT_THRESHOLD).toBe(50);
    expect(isFyp94VaultEligible({ pulseScore: 50 })).toBe(true);
    expect(isFyp94VaultEligible({ pulseScore: 49 })).toBe(false);
  });

  it("selects high-ThrillScore vault clips", () => {
    const selected = selectFyp94VaultClips({ clips, limit: 2 });
    expect(selected).toHaveLength(2);
    expect(selected[0].thrillScore).toBe(90);
  });

  it("creates and unlocks vault window", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const vault = createFyp94PulseVault({
      anonymousUserId: "anon_1",
      clipIds: ["1", "2"],
      now,
    });

    const unlocked = unlockFyp94PulseVault({ vault, now, hoursOpen: 48 });

    expect(vault.state).toBe("locked");
    expect(unlocked.state).toBe("unlocked");
    expect(unlocked.relocksAt).toBe("2026-01-03T00:00:00.000Z");
  });

  it("relocks vault after expiry", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const vault = createFyp94PulseVault({
      anonymousUserId: "anon_1",
      clipIds: ["1", "2"],
      now,
    });

    const unlocked = unlockFyp94PulseVault({ vault, now, hoursOpen: 1 });
    const relocked = relockFyp94PulseVault(unlocked, new Date("2026-01-01T02:00:00.000Z"));

    expect(relocked.state).toBe("relocked");
  });

  it("recycles vault clips into normal pool", () => {
    const recycled = recycleFyp94VaultClipsToPool({ vaultClipIds: ["1"], clips });
    expect(recycled[0].thrillScore).toBe(87);
    expect(recycled[1].thrillScore).toBe(80);
  });
});
