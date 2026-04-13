import GmarLiveClient from "@/components/gmar/GmarLiveClient";

export default function GmarPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>GMAR</h1>
      <GmarLiveClient />
    </main>
  );
}
