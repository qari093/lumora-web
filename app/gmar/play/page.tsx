export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
import PortalShell from "@/components/portals/PortalShell";
import MiniArena from "@/components/gmar/MiniArena";

export default function GmarPlayPage() {
  return (
    <PortalShell title="GMAR" subtitle="Play instantly. No dead ends.">
      <main className="px-4 pb-24 pt-4">
        <MiniArena />
      </main>
      <div id="LUMORA_PORTAL_ALIVE_GMAR_PLAY" style={{ display: "none" }}>alive</div>
    </PortalShell>
  );
}
