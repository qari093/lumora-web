import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateAllowlistInviteContract } from "@/lib/softlaunch/allowlistInviteContract";

describe("soft-launch allowlist / invite contract activation", () => {
  it("passes valid allowlist contract", () => {
    const invites = JSON.parse(fs.readFileSync("data/softlaunch/allowlist.json", "utf8"));
    const out = evaluateAllowlistInviteContract({
      mode: "allowlist",
      invites,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.contract.totalInvites).toBe(5);
      expect(out.contract.pendingInvites).toBe(3);
      expect(out.contract.acceptedInvites).toBe(2);
      expect(out.contract.valid).toBe(true);
    }
  });

  it("rejects duplicate email", () => {
    const out = evaluateAllowlistInviteContract({
      mode: "allowlist",
      invites: [
        { email: "a@lumora.app", code: "CODE001", status: "pending" },
        { email: "a@lumora.app", code: "CODE002", status: "accepted" },
      ],
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_email" });
  });

  it("rejects duplicate code", () => {
    const out = evaluateAllowlistInviteContract({
      mode: "allowlist",
      invites: [
        { email: "a@lumora.app", code: "CODE001", status: "pending" },
        { email: "b@lumora.app", code: "CODE001", status: "accepted" },
      ],
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_code" });
  });

  it("rejects missing invites", () => {
    const out = evaluateAllowlistInviteContract({
      mode: "allowlist",
      invites: [],
    });

    expect(out).toEqual({ ok: false, reason: "missing_invites" });
  });
});
