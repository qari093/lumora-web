import { ledgerFor } from "@/src/lib/wallet/mem";

export function computeOwnerSpendEuros(ownerId: string): number {
  const rows = ledgerFor(ownerId);
  const spend = rows.filter(r => r.kind === "debit" && typeof r.reason === "string" && r.reason.startsWith("ads:"))
                    .reduce((s, r) => s + (r.euros || 0), 0);
  return +spend.toFixed(2);
}
