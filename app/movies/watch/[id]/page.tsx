import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { id: string } }) {
  const demo = getDemoContent();
  const m = demo.movies.find((x) => x.id === params.id) ?? demo.movies[0];

  return (
    <PortalShell title="Movie Watch" subtitle="Demo movie watch page" icon="🎞️" accent="#f59e0b">
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{m?.title ?? "Unknown"}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{m?.year ?? "—"} • {m?.genre ?? "—"}</div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
            Demo watch shell: replace with real player later.
          </div>
        </div>
        <a href="/movies/portal" style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "inline-block", fontWeight: 900, textDecoration: "none", color: "inherit" }}>
          ← Back to Movies Portal
        </a>
      </div>
    </PortalShell>
  );
}
