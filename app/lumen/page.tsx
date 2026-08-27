import Link from "next/link";
import { getLumenCoreEvolutionHooks } from "@/src/core/home-beacon/lumenEvolution";

export const dynamic = "force-dynamic";

export default function LumenPage() {
  const lumen = getLumenCoreEvolutionHooks();

  return (
    <main
      data-lumen-production-state="runtime-connected"
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Lumen AI</h1>

      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Lumen is Lumora&apos;s intelligence entry point, connected to the active
        NEXA and Lumexa intelligence surfaces.
      </p>

      <section
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 14,
        }}
      >
        <div style={{ fontWeight: 700 }}>Lumen core</div>
        <div style={{ marginTop: 8, opacity: 0.75 }}>
          Runtime: {lumen.activeNow ? "active" : "prepared"}
        </div>
      </section>

      <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
        <Link href="/nexa">Open NEXA</Link>
        <Link href="/lumexa">Open Lumexa</Link>
      </div>

      <div id="LUMORA_LUMEN_PRODUCTION_REALITY" style={{ display: "none" }}>
        runtime-connected
      </div>
    </main>
  );
}
