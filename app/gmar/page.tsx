import PortalShell from "@/components/portals/PortalShell";
import PortalStatusGrid from "@/components/portals/PortalStatusGrid";

export const dynamic = "force-dynamic";

export default async function GmarPage() {
  return (
    <PortalShell title="GMAR" subtitle="Games portal (shell active)">
      <PortalStatusGrid />
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "10px 0", fontSize: 16 }}>Quick links</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href="/gmar/games/astro-shooter" style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #1f2937", background: "#0b1020", textDecoration: "none" }}>
            Astro Shooter (placeholder route)
          </a>
          <a href="/gmar/games/zen-flow" style={{ padding: "10px 12px", borderRadius: 14, border: "1px solid #1f2937", background: "#0b1020", textDecoration: "none" }}>
            Zen Flow (placeholder route)
          </a>
        </div>
        <p style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
          Next steps will attach real game catalog + launch tiles.
        </p>
      </section>
    </PortalShell>
  );
}
