import type { Metadata } from "next";
import Link from "next/link";
import { getVideosHealth } from "@/lib/videos/runtime";

export const metadata: Metadata = {
  title: "Videos | Lumora",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function VideosPage() {
  const health = getVideosHealth();

  return (
    <main
      data-videos-production-state="runtime-connected"
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Videos</h1>

      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Lumora&apos;s video runtime is active and connected to the wider media
        ecosystem.
      </p>

      <section
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 14,
        }}
      >
        <div style={{ fontWeight: 700 }}>Runtime status</div>
        <div style={{ marginTop: 8, opacity: 0.75 }}>
          Mode: {health.mode} · Available items: {health.items}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
          marginTop: 20,
        }}
      >
        <Link href="/fyp">Open video FYP</Link>
        <Link href="/watch">Open Watch</Link>
        <Link href="/video-gen">Create video</Link>
        <Link href="/api/videos/health">Video runtime health</Link>
      </section>

      <div id="LUMORA_VIDEOS_PRODUCTION_REALITY" style={{ display: "none" }}>
        runtime-connected
      </div>
    </main>
  );
}
