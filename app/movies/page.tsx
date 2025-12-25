// FILE: app/movies/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies — Lumora",
  description: "Movies portal (CineVerse) inside Lumora.",
};

export default function MoviesPage() {
  return (
    <main style={{ padding: 18 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 6px" }}>Movies</h1>
      <p style={{ opacity: 0.8, margin: "0 0 14px" }}>
        CineVerse portal is live. Catalog wiring will be attached here.
      </p>

      <section style={{ display: "grid", gap: 10, maxWidth: 820 }}>
        <a href="/lumaspace" style={{ textDecoration: "underline" }}>
          ← Back to LumaSpace
        </a>
        <a href="/emml/chart" style={{ textDecoration: "underline" }}>
          EMML Chart
        </a>
        <a href="/gmar" style={{ textDecoration: "underline" }}>
          GMAR Arcade
        </a>
        <a href="/nexa" style={{ textDecoration: "underline" }}>
          NEXA GX
        </a>
      </section>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Status</div>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85 }}>
          <li>Route: /movies (200)</li>
          <li>Next: populate catalog + browsing UI</li>
        </ul>
      </div>
    </main>
  );
}
