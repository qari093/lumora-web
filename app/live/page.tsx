import LivePortalClient from "@/components/live/LivePortalClient";

export default function LivePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Live</h1>
      <LivePortalClient />
    </main>
  );
}
