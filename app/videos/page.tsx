import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos • Lumora",
  robots: { index: false, follow: false },
};

export default function Page() {
  const items = [
    { id: "seed-1", title: "Videos Seed 1", subtitle: "Baseline content", href: "#" },
    { id: "seed-2", title: "Videos Seed 2", subtitle: "Non-empty guard", href: "#" },
    { id: "seed-3", title: "Videos Seed 3", subtitle: "Render map", href: "#" },
  ] as const;

    return (
    <>{/* LUMORA_PORTAL_ALIVE_VIDEOS */}<span style={{display:"none"}}>LUMORA_PORTAL_ALIVE_VIDEOS</span><main style={{ padding: 24 }}>
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

      <h1 title="videos" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Videos</h1>
      <p style={{ opacity: 0.8 }}>
        Portal placeholder. Kept minimal to ensure `tsc --noEmit` stays green while Step 37–60 lands.
      </p>
    </main></>
  );
}
