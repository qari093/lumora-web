import LiveShell from "@/components/live/LiveShell";
import { getLivePortalConfig } from "@/src/live/activation/livePortalConfig";

export const metadata = {
  title: "Lumora Live Ω∞",
  description: "Synchronized human aliveness with protected humanity.",
};

export default function LivePage() {
  const items = [
    { id: "live-seed-1", title: "Live seed 1" },
    { id: "live-seed-2", title: "Live seed 2" },
  ] as const;

  const live = getLivePortalConfig();

  return (
      <>
        <span style={{ display: "none" }}>LUMORA_PORTAL_ALIVE_LIVE</span>
        <div style={{ display: "none" }}>
          {items.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
        {/* LUMORA_PORTAL_ALIVE_LIVE */}
    <main data-testid="lumora-live-page" style={{ minHeight: "100vh", padding: "24px" }}>
      <section aria-label="Lumora Live Ω∞">
        <p style={{ opacity: 0.72, marginBottom: 8 }}>Lumora Live Ω∞</p>
        <h1 title="live" style={{ fontSize: 36, lineHeight: 1.1, margin: 0 }}>
          Synchronized human aliveness
        </h1>
        <p style={{ maxWidth: 720, marginTop: 16, opacity: 0.8 }}>
          Live is runtime-visible, registry-backed, and ready for activation layers.
        </p>
        <div
          data-testid="live-runtime-status"
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          Status: {live.enabled ? "enabled" : "disabled"} · Route: {live.route}
        </div>
      <LiveShell />
      </section>
    </main>
  
      </>);
}
