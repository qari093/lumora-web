import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  const demo = getDemoContent();
  const g = demo.games.find((x) => x.slug === params.slug) ?? demo.games[0];

  return (
    <PortalShell title="GMAR Game" subtitle="Demo game page (placeholder shell)" icon="🕹️" accent="#fb7185">
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{g?.name ?? "Unknown game"}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{g?.genre ?? "—"} • {g?.status ?? "—"}</div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
            This is a demo shell to prove routing + portal UI. Game runtime can be plugged in next.
          </div>
        </div>
        <a href="/gmar" style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "inline-block", fontWeight: 900, textDecoration: "none", color: "inherit" }}>
          ← Back to GMAR
        </a>
      </div>
    </PortalShell>
  );
}
