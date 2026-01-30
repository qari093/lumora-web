
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070b14',
};

export const dynamic = "force-dynamic";

export default function WatchPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Watch</h1>
      <p style={{ opacity: 0.85 }}>
        Watch portal is connected. Content modules will hydrate here.
      </p>
    </main>
  );
}
