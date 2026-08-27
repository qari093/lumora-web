import Link from "next/link";
import StatusBadge from "@/app/_modules/hybrid/StatusBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export default function HybridPage() {
  return (
    <main
      data-hybrid-production-state="runtime-connected"
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Hybrid Studio</h1>

      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Create and transform Lumora avatars and expressive visual assets using
        the active Hybrid runtime.
      </p>

      <div style={{ marginTop: 20 }}>
        <StatusBadge />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        }}
      >
        <Link href="/avatar-lab">Avatar Lab</Link>
        <Link href="/emoji-lab">Emoji Lab</Link>
        <Link href="/avatar-bridge">Avatar Bridge</Link>
      </div>

      <div id="LUMORA_HYBRID_PRODUCTION_REALITY" style={{ display: "none" }}>
        runtime-connected
      </div>
    </main>
  );
}
