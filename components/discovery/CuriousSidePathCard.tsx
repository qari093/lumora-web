import { createCuriousSidePath } from "@/lib/discovery/curiousSidePath";

export default function CuriousSidePathCard() {
  const path = createCuriousSidePath({
    currentLane: "Cosmic Drift",
    watchedLanes: ["Cosmic Drift"],
    intensity: 3
  });

  return (
    <section className="lumora-portal-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Curious Side-Path</p>
      <h2 className="mt-4 text-3xl font-black">{path.label}</h2>
      <p className="mt-4 text-white/65">{path.from} → {path.to}</p>
    </section>
  );
}
