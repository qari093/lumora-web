import PortalShell from "@/components/portals/PortalShell";
import PortalStatusGrid from "@/components/portals/PortalStatusGrid";

export const dynamic = "force-dynamic";

export default async function NexaPage() {
  return (
    <PortalShell title="NEXA" subtitle="Wellness engines (shell active)">
      <PortalStatusGrid />
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "10px 0", fontSize: 16 }}>Engines</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9, lineHeight: 1.6 }}>
          <li>Sleep</li>
          <li>Hydration</li>
          <li>Nutrition</li>
          <li>Training</li>
          <li>Recovery</li>
        </ul>
        <p style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
          Next steps will connect these to GX schema + dashboards.
        </p>
      </section>
    </PortalShell>
  );
}
