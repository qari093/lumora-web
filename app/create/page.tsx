export const dynamic = "force-dynamic";

export default function CreatePage() {
  return (
    <main data-create-ui="1" style={{ padding: 24, fontFamily: "system-ui, Segoe UI, Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: "8px 0" }}>Create</h1>
      <p style={{ opacity: 0.72, margin: "6px 0 14px" }}>
        Lumora Creator Studio (stub). Wire Cloudflare Stream upload + publish flow later.
      </p>

      <section style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <a
          data-create-cta="upload"
          href="/create/upload"
          style={{
            display: "block",
            padding: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            textDecoration: "none",
          }}
        >
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Upload</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Select a file and upload via direct upload token.</p>
        </a>

        <a
          data-create-cta="record"
          href="/create/record"
          style={{
            display: "block",
            padding: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            textDecoration: "none",
          }}
        >
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Record</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Record from camera/mic (client flow) and publish.</p>
        </a>

        <a
          data-create-cta="publish"
          href="/create/publish"
          style={{
            display: "block",
            padding: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            textDecoration: "none",
          }}
        >
          <h2 style={{ fontSize: 16, margin: "0 0 6px" }}>Publish</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>Finalize metadata, visibility, and publish.</p>
        </a>

        <p style={{ margin: "10px 0 0" }}>
          <a href="/movies" style={{ textDecoration: "underline" }}>Movies</a> ·{" "}
          <a href="/gmar" style={{ textDecoration: "underline" }}>GMAR</a> ·{" "}
          <a href="/nexa" style={{ textDecoration: "underline" }}>NEXA</a> ·{" "}
          <a href="/creator" style={{ textDecoration: "underline" }}>Creator</a>
        </p>
      </section>
    </main>
  );
}
