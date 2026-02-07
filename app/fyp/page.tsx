import PortalShell from "@/components/portals/PortalShell";
import PortalStatusGrid from "@/components/portals/PortalStatusGrid";

export const dynamic = "force-dynamic";

export default async function FypPage() {
  return (
    <PortalShell title="FYP" subtitle="For You feed (shell active)">
      <PortalStatusGrid />
      <section style={{ marginTop: 14 }}>
        <h2 style={{ margin: "10px 0", fontSize: 16 }}>What’s live right now</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9, lineHeight: 1.6 }}>
          <li>Feed endpoint: <code>/api/fyp/feed</code></li>
          <li>Generate endpoint: <code>/api/fyp/generate</code></li>
          <li>Interact endpoint: <code>/api/fyp/interact</code></li>
        </ul>
      </section>
    </PortalShell>
  );
}
