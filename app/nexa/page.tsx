import NexaLiveClient from "@/components/nexa/NexaLiveClient";

export default function NexaPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>NEXA</h1>
      <NexaLiveClient />
    </main>
  );
}
