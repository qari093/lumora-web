import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="Videos"
      subtitle="Browse demo videos (grid list)"
      icon="��"
      accent="#60a5fa"
    >
      (<div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontSize: 13, opacity: 0.85 }}>Collection view • tap to watch.</div>
      <div style={{ display: "grid", gap: 10 }}>
        {demo.videos.map((v) => (
          <a key={v.id} href={`/watch/${v.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 900 }}>{v.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{v.tags?.join(" • ")}</div>
              </div>
              <div aria-hidden style={{ fontSize: 22 }}>🎬</div>
            </div>
          </a>
        ))}
      </div>
    </div>)
    </PortalShell>
  );
}
