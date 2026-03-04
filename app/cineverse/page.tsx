export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma as getPrisma } from "@/lib/prisma";

export default async function CineVersePage() {
  const prisma = getPrisma();

  // __LUMORA_DBG_ERR__ (dev-only inline diagnostics)
  const __dbg = { ok: true as boolean, err: "" as string };

  // Delegate name is stable as long as schema keeps CineVerseMovie model name.
  // If schema maps it to underlying table "CineverseMovie", Prisma handles it.
  let items: any[] = [];
  try {
    items = await prisma.cineVerseMovie.findMany({
      orderBy: { createdAt: "desc" as any },
      take: 50,
      select: {
        id: true,
        title: true,
        source: true,
        license: true,
        videoUrl: true,
        resolution: true,
        category: true,
        createdAt: true,
      },
    });
  } catch (e: any) {
    __dbg.ok = false;
    __dbg.err = String(e?.message || e);
  }

  return (
    <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>CineVerse (Test)</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>Seeded public-domain titles for portal validation.</p>

      {!__dbg.ok ? (
        <pre style={{ padding: 12, border: "1px solid rgba(255,80,80,.35)", borderRadius: 10, whiteSpace: "pre-wrap" }}>
          {__dbg.err}
        </pre>
      ) : null}

      {items.length === 0 ? (
        <div style={{ padding: 12, border: "1px solid rgba(255,255,255,.15)", borderRadius: 10 }}>
          No titles yet. Run the seed step.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 14, display: "grid", gap: 10 }}>
          {items.map((m) => (
            <li key={m.id} style={{ padding: 12, border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{m.title}</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    {(m as any).category} · {(m as any).license} · {(m as any).source} · res={(m as any).resolution}
                  </div>
                </div>
                <a href={(m as any).videoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                  Open video
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
