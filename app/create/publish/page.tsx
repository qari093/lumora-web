export const dynamic = "force-dynamic";

export default function CreatePublishPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Create · Publish</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Publish flow shell (CI-safe). Real publish pipeline will be re-attached after PWA gates.
      </p>
    </main>
  );
}
