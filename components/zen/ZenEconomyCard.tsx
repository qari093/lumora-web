import { createZenLedgerEntry } from "@/lib/zen/zenEconomy";

export default function ZenEconomyCard() {
  const entry = createZenLedgerEntry({ action: "gift", amount: 1, reason: "quiet_support" });

  return (
    <section className="lumora-portal-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Zen Economy</p>
      <h2 className="mt-4 text-3xl font-black">Calm value, no casino energy.</h2>
      <p className="mt-4 text-white/65">Action: {entry.action} · Amount: {entry.amount}</p>
    </section>
  );
}
