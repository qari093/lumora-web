import Link from "next/link";

export const runtime = "nodejs";

export default async function VideoGenPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Video Gen (Test Phase)</h1>
      <p style={{ opacity: 0.8 }}>
        This page is a minimal guarded hook to the Video Gen API. It does not store prompts server-side.
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/video-gen/demo" style={{ padding: "10px 14px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10 }}>
          Open Demo
        </Link>
        <Link href="/portals" style={{ padding: "10px 14px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10 }}>
          Back to Portals
        </Link>
      </div>
    </main>
  );
}
