import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="NEXA"
      subtitle="Calm + focus hub (demo)"
      icon="🧠"
      accent="#a78bfa"
    >
      (<div style={{ display: "grid", gap: 12 }}>
      <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ fontWeight: 900 }}>Today’s focus</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
          Demo panel: Calm Index, Focus Ratio, Burnout Risk (placeholder values).
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <div>🫧 Calm Index: <b>0.78</b></div>
          <div>🎯 Focus Ratio: <b>0.64</b></div>
          <div>⚠️ Burnout Risk: <b>0.21</b></div>
        </div>
      </div>
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        This page is intentionally distinct to confirm iPhone rendering + routing.
      </div>
    </div>)
    </PortalShell>
  );
}
