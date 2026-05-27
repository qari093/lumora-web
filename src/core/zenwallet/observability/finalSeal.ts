import fs from "fs";

export const REQUIRED_ZENWALLET_LOCKS = Array.from({ length: 17 }, (_, index) => {
  const pack = String(index + 1).padStart(2, "0");
  if (pack === "01") return ".zenwallet_pack01_governance_foundations_lock";
  return `.zenwallet_pack${pack}_lock`;
});

export function collectZenWalletSealInput() {
  const missingLocks = REQUIRED_ZENWALLET_LOCKS.filter((lock) => !fs.existsSync(lock));
  return {
    ok: missingLocks.length === 0,
    requiredLocks: REQUIRED_ZENWALLET_LOCKS.length,
    missingLocks,
    checkedAt: new Date().toISOString(),
  };
}

export function buildZenWalletFinalSeal() {
  const input = collectZenWalletSealInput();
  return {
    ...input,
    system: "ZenWallet Flawless Global Ω∞",
    status: input.ok ? "PASS" : "FAILED",
    futureExpansionReady: input.ok,
    productionHardeningReady: input.ok,
  };
}
