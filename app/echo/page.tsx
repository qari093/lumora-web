export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma as getPrisma } from "@/lib/prisma";

export default async function EchoPage() {
  const prisma = getPrisma();

  // __LUMORA_DBG_ERR__ (dev-only inline diagnostics)
  const __dbg = { ok: true as boolean, err: "" as string };

  let items: any[] = [];
  try {
    items = await prisma.echoTrack.findMany({
      orderBy: { createdAt: "desc" as any },
      take: 80,
      select: { id: true, title: true, artist: true, license: true, audioUrl: true, genre: true, createdAt: true },
    });
  } catch (e: any) {
    __dbg.ok = false;
    __dbg.err = String(e?.message || e);
  }

  return (
    <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Lumora Echo (Test)</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>Seeded public-domain tracks for portal validation.</p>

      {!__dbg.ok ? (
        <pre style={{ padding: 12, border: "1px solid rgba(255,80,80,.35)", borderRadius: 10, whiteSpace: "pre-wrap" }}>
          {__dbg.err}
        </pre>
      ) : null}

      {items.length === 0 ? (
        <div style={{ padding: 12, border: "1px solid rgba(255,255,255,.15)", borderRadius: 10 }}>
          No tracks yet. Run the seed step.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 14, display: "grid", gap: 10 }}>
          {items.map((t) => (
            <li key={t.id} style={{ padding: 12, border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.title}</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    {t.artist} · {t.genre} · {t.license}
                  </div>
                </div>
                <a href={t.audioUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                  Open audio
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
