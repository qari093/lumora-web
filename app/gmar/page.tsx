import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="GMAR"
      subtitle="Arcade portal (demo tiles)"
      icon="🎮"
      accent="#fb7185"
    >
      (<div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.85 }}>Demo arcade tiles (visual differentiation).</div>
      <div style={{ display: "grid", gap: 10 }}>
        {demo.games.map((g) => (
          <a key={g.slug} href={`/gmar/games/${g.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 900 }}>{g.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{g.genre} • {g.status}</div>
              </div>
              <div aria-hidden style={{ fontSize: 22 }}>🕹️</div>
            </div>
          </a>
        ))}
      </div>
    </div>)
    </PortalShell>
  );
}
