import PortalShell from "@/components/portals/PortalShell";
import PortalStatusGrid from "@/components/portals/PortalStatusGrid";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  return (
    <PortalShell title="Videos" subtitle="Feed + upload (shell active)">
      <PortalStatusGrid />
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "10px 0", fontSize: 16 }}>Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href="/videos/upload" style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #1f2937", background: "#0b1020", textDecoration: "none" }}>
            Upload
          </a>
          <a href="/video-gen" style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #1f2937", background: "#0b1020", textDecoration: "none" }}>
            Video Generator
          </a>
        </div>
      </section>
    </PortalShell>
  );
}
