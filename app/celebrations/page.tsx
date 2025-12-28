import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="Celebrations"
      subtitle="Events + energy (demo)"
      icon="✨"
      accent="#22c55e"
    >
      (<div style={{ display: "grid", gap: 12 }}>
      <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ fontWeight: 900 }}>Today’s Celebration</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
          Demo-safe listing (no server dependency required).
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {demo.celebrations.map((c) => (
          <div key={c.slug} style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontWeight: 900 }}>{c.title}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{c.window}</div>
          </div>
        ))}
      </div>
    </div>)
    </PortalShell>
  );
}
