export const dynamic = "force-dynamic";

export default function CreateUploadPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Create · Upload</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Upload flow shell (CI-safe). Media upload engine attaches after Cloudflare Stream gates.
      </p>
    </main>
  );
}
