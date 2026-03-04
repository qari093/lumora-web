/* FILE: app/not-found.tsx
   Next.js App Router special file for 404s.
   Keep dependency-free to avoid prerender/runtime import issues. */

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <main style={{ padding: 24, maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: "8px 0 12px" }}>Not Found</h1>
      <p style={{ opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/" style={{ textDecoration: "underline" }}>Go Home</a>
        <a href="/portals" style={{ textDecoration: "underline" }}>Portals</a>
      </div>
    </main>
  );
}
