import { createCivilizationSeal, LUMORA_FINAL_SEAL_INPUT } from "@/lib/final-seal/civilizationSeal";

export default function FinalCivilizationSealCard() {
  const seal = createCivilizationSeal(LUMORA_FINAL_SEAL_INPUT);

  return (
    <section className="lumora-portal-card p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Final Seal</p>
      <h2 className="mt-4 text-3xl font-black">Lumora Civilization Seal</h2>
      <p className="mt-4 text-white/65">
        Status: {seal.status} · Score: {seal.score}% · Mode: {seal.launchMode}
      </p>
    </section>
  );
}
