import PortalShell from "@/components/portals/PortalShell";
import PortalStatusGrid from "@/components/portals/PortalStatusGrid";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  return (
    <PortalShell title="Live" subtitle="Rooms + realtime (shell active)">
      <PortalStatusGrid />
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "10px 0", fontSize: 16 }}>Room operations</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9, lineHeight: 1.6 }}>
          <li>Public rooms: <code>/api/live/rooms/public</code></li>
          <li>Create/publish: <code>/api/live/publish</code></li>
          <li>Status: <code>/api/live/status</code></li>
        </ul>
      </section>
    </PortalShell>
  );
}
