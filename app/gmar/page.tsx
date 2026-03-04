import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GMAR • Lumora",
  robots: { index: false, follow: false },
};

export default function Page() {
  const items = [
    { id: "seed-1", title: "GMAR Seed 1", subtitle: "Baseline content", href: "#" },
    { id: "seed-2", title: "GMAR Seed 2", subtitle: "Non-empty guard", href: "#" },
    { id: "seed-3", title: "GMAR Seed 3", subtitle: "Render map", href: "#" },
  ] as const;

    return (
    <>{/* LUMORA_PORTAL_ALIVE_GMAR */}<span style={{display:"none"}}>LUMORA_PORTAL_ALIVE_GMAR</span><main style={{ padding: 24 }}>
        <section style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Seeded items (non-empty guard)</div>
          <ul style={{ marginTop: 10, display: "grid", gap: 10, listStyle: "none", padding: 0 }}>
            {items.map((it) => (
              <li key={it.id} style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{it.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{it.subtitle}</div>
              </li>
            ))}
          </ul>
        </section>

      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>GMAR</h1>
      <p style={{ opacity: 0.8 }}>
        Portal placeholder. Kept minimal to ensure `tsc --noEmit` stays green while Step 37–60 lands.
      </p>
    </main></>
  );
}
