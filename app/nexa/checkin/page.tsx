import PortalShell from "@/components/portals/PortalShell";
import QuickCheckIn from "@/components/nexa/QuickCheckIn";

export default function NexaCheckInPage() {
  return (
    <PortalShell title="NEXA" subtitle="Usable now. Tiny ritual, real state.">
      <main className="px-4 pb-24 pt-4">
        <QuickCheckIn />
      </main>
      <div id="LUMORA_PORTAL_ALIVE_NEXA_CHECKIN" style={{ display: "none" }}>alive</div>
    </PortalShell>
  );
}
