import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="Share"
      subtitle="Demo share hub"
      icon="📤"
      accent="#38bdf8"
    >
      (<div style={{ display: "grid", gap: 12 }}>
      <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ fontWeight: 900 }}>Share links</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
          Demo: copy + share actions can be wired next.
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <a href="/fyp" style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "block", fontWeight: 900, textDecoration: "none", color: "inherit" }}>Copy FYP link</a>
        <a href="/movies/portal" style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "block", fontWeight: 900, textDecoration: "none", color: "inherit" }}>Copy Movies link</a>
      </div>
    </div>)
    </PortalShell>
  );
}
