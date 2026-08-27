import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file: string) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

describe("Mega Step 25 wallet / credits / economy production reality", () => {
  it("session-binds the wallet index to the authenticated owner", () => {
    const src = read("app/wallets/page.tsx");

    expect(src).toContain("requireUserSession");
    expect(src).toContain("where: { ownerId: userId }");
    expect(src).toContain("auth.identity.userId");
  });

  it("prevents arbitrary owner wallet page disclosure", () => {
    const src = read("app/wallets/[ownerId]/page.tsx");

    expect(src).toContain("requireUserSession");
    expect(src).toContain("ownerId !== auth.identity.userId");
    expect(src).toContain("notFound()");
  });

  it("removes demo identity and fake credits checkout behavior", () => {
    const src = read("app/buy-credits/BuyCreditsClient.tsx");

    expect(src).not.toContain("demo-user-123");
    expect(src).not.toContain("/api/stripe/create-checkout-session");
    expect(src).toContain(
      'data-buy-credits-production-state="temporarily-unavailable"',
    );
    expect(src).toContain("disabled");
  });

  it("removes production vendor test top-up controls", () => {
    const src = read("pages/vendor/wallet.tsx");

    expect(src).not.toContain("/api/wallet/topup");
    expect(src).not.toContain("Test mode top-up");
    expect(src).toContain(
      'data-vendor-wallet-production-state="read-only"',
    );
  });

  it("keeps airdrop eligibility but disables non-transactional claim paths", () => {
    const src = read("components/lumaspace/AirdropEngine.tsx");

    expect(src).not.toContain("/api/wallets/ensure");
    expect(src).not.toContain("/api/wallet/credit");
    expect(src).toContain("const canClaim = false;");
    expect(src).toContain(
      "Airdrop claiming is temporarily unavailable during private beta",
    );
  });

  it("preserves authenticated wallet withdrawal inheritance", () => {
    expect(read("app/api/wallet/withdraw/route.ts"))
      .toContain("../debit/route");

    expect(read("app/api/wallet/debit/route.ts"))
      .toContain("requireUserSession");
  });

  it("preserves authenticated canonical ZenWallet ledger ownership", () => {
    expect(read("app/api/zenwallet/ledger/route.ts"))
      .toContain("requireUserSession");
  });

  it("keeps transaction-id validation side-effect free", () => {
    const src = read("app/api/wallet/txid-check/route.ts");

    expect(src).toContain("checkTransactionId");
    expect(src).not.toContain("prisma.");
    expect(src).not.toMatch(/\.(create|update|updateMany|delete|deleteMany|upsert)\(/);
  });
});
