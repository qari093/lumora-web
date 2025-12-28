import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page() {
  const demo = getDemoContent();

  return (
    <PortalShell
      title="Movies Portal"
      subtitle="Browse demo movies (tap to watch)"
      icon="🍿"
      accent="#f59e0b"
    >
      (<div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontSize: 13, opacity: 0.85 }}>Demo movies: <b>{demo.movies.length}</b></div>
      <div style={{ display: "grid", gap: 10 }}>
        {demo.movies.map((m) => (
          <a key={m.id} href={`/movies/watch/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 900 }}>{m.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{m.year} • {m.genre}</div>
              </div>
              <div aria-hidden style={{ fontSize: 22 }}>🎞️</div>
            </div>
          </a>
        ))}
      </div>
    </div>)
    </PortalShell>
  );
}
