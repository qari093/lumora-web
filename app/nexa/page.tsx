import NexaLiveClient from "@/components/nexa/NexaLiveClient";

export default function NexaPage() {
  const items = [
    { id: "nexa-seed-1", title: "NEXA seed 1" },
    { id: "nexa-seed-2", title: "NEXA seed 2" },
  ] as const;

  return (
      <>
        <span style={{ display: "none" }}>LUMORA_PORTAL_ALIVE_NEXA</span>
        <div style={{ display: "none" }}>
          {items.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
        {/* LUMORA_PORTAL_ALIVE_NEXA */}
    <main style={{ padding: 24 }}>
      <a href="/nexa/checkin" style={{ display: "none" }}>NEXA check-in</a>
      <h1 title="nexa" style={{ fontSize: 28, marginBottom: 16 }}>NEXA</h1>
      <NexaLiveClient />
    </main>
  
      </>);
}
