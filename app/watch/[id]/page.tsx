import { PortalShell } from "@/app/_components/ui/PortalShell";
import { getDemoContent } from "@/app/_lib/demo/content";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { id: string } }) {
  const demo = getDemoContent();
  const v = demo.videos.find((x) => x.id === params.id) ?? demo.videos[0];

  return (
    <PortalShell title="Watch" subtitle="Demo watch page (iPhone-safe)" icon="▶️" accent="#34d399">
      <div style={{ display: "grid", gap: 12 }}>
        {v ? (
          <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{v.title}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              {v.creator} • {v.durationSec}s
            </div>
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
              Demo player shell: replace with real video player later.
            </div>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <a
                href="/fyp"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  display: "inline-block",
                  fontWeight: 900,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                ← Back to FYP
              </a>
              <a
                href="/videos"
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  display: "inline-block",
                  fontWeight: 900,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                🎥 Browse Videos
              </a>
            </div>
          </div>
        ) : (
          <div>Missing video</div>
        )}
      </div>
    </PortalShell>
  );
}
